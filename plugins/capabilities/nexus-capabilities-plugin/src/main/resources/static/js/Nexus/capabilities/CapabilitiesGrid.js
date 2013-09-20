/*
 * Copyright (c) 2008-2013 Sonatype, Inc.
 *
 * All rights reserved. Includes the third-party code listed at http://links.sonatype.com/products/nexus/pro/attributions
 * Sonatype and Sonatype Nexus are trademarks of Sonatype, Inc. Apache Maven is a trademark of the Apache Foundation.
 * M2Eclipse is a trademark of the Eclipse Foundation. All other trademarks are the property of their respective owners.
 */
/*global NX, Ext, Sonatype, Nexus*/

/**
 * Capabilities master grid.
 *
 * @since 2.7
 */
NX.define('Nexus.capabilities.CapabilitiesGrid', {
    extend: 'Ext.grid.GridPanel',

    mixins: [
        'Nexus.LogAwareMixin'
    ],

    requires: [
        'Nexus.capabilities.CapabilitiesMediator'
    ],

    /**
     * @override
     */
    initComponent: function () {
        var self = this,
            mediator = Nexus.capabilities.CapabilitiesMediator,
            icons = Nexus.capabilities.Icons;

        self.ds = mediator.capabilityStore;
        mediator.capabilityStore.on('beforeload', self.rememberSelection, self);
        mediator.capabilityStore.on('load', self.recallSelection, self);

        self.loadMask = {
            msg: 'Loading...',
            msgCls: 'loading-indicator'
        }

        // FIXME: This does not appear to function
        self.emptyText = 'No capabilities';

        self.stripeRows = true;

        var columns = [
            // checkbox
            self.sm,

            // icon
            {
                width: 30,
                resizable: false,
                sortable: false,
                fixed: true,
                hideable: false,
                menuDisabled: true,
                renderer: function (value, metaData, record) {
                    var typeName = record.get('typeName'),
                        enabled = record.get('enabled'),
                        active = record.get('active'),
                        error = record.get('error'),
                        iconName;

                    if (!typeName) {
                        iconName = 'capability_new';
                    }
                    else if (enabled && error) {
                        iconName = 'capability_error';
                    }
                    else if (enabled && active) {
                        iconName = 'capability_active';
                    }
                    else if (enabled && !active) {
                        iconName = 'capability_passive';
                    }
                    else {
                        iconName = 'capability_disabled';
                    }

                    return icons.get(iconName).img;
                }
            },
            {
                id: 'typeName',
                width: 175,
                header: 'Type',
                dataIndex: 'typeName',
                sortable: true
            },
            {
                id: 'description',
                width: 250,
                header: 'Description',
                dataIndex: 'description',
                sortable: true
            },
            {
                id: 'notes',
                width: 175,
                header: 'Notes',
                dataIndex: 'notes',
                sortable: true
            }
        ];
        // Allow contributors to add to the view.
        Nexus.capabilities.CapabilitiesMediator.fireEvent('capabilities.capabilitiesGrid.configureColumns', columns);

        self.cm = NX.create('Ext.grid.ColumnModel', {
            columns: columns
        });
        self.autoExpandColumn = 'notes';

        // FIXME: Toolbar, and actions for them should really be handled by another class
        // FIXME: Should try to avoid using component ids here, a field ref would be preferable, or itemId instead.

        self.tbar = [
            {
                text: 'Refresh',
                tooltip: 'Refresh capabilities',
                iconCls: icons.get('refresh').cls,
                handler: function () {
                    mediator.refreshHandler();
                }
                // always enabled
            },
            {
                text: 'Add',
                itemId: 'add',
                iconCls: icons.get('capability_add').cls,
                tooltip: 'Add a new capability',
                handler: function () {
                    mediator.addHandler();
                },
                disabled: true
            },
            {
                text: 'Delete',
                itemId: 'delete',
                iconCls: icons.get('capability_delete').cls,
                tooltip: 'Delete selected capability',
                handler: function () {
                    mediator.deleteHandler(self.getSelectionModel().getSelections());
                },
                disabled: true
            }
        ];

        self.constructor.superclass.initComponent.apply(self, arguments);
    },

    /**
     * @private
     */
    selectionChanged: function (sm) {
        var self = this,
            records,
            provider,
            i,
            mediator = Nexus.capabilities.CapabilitiesMediator,
            sp = Sonatype.lib.Permissions;

        if (sm.getCount() !== 0) {
            var deleteButton = self.getTopToolbar().getComponent('delete');
            if (sp.checkPermission('nexus:capabilities', sp.DELETE)) {
                deleteButton.enable();
            }
            else {
                deleteButton.disable();
            }
        }
    },

    /**
     * @private
     */
    selectedRecords: undefined,

    /**
     * Remember what records are selected.
     *
     * @private
     */
    rememberSelection: function () {
        this.selectedRecords = this.getSelectionModel().getSelections();
    },

    /**
     * Recall selection from previous remembered selection.
     *
     * @private
     */
    recallSelection: function () {
        var self = this,
            toSelect = [];

        if (self.selectedRecords === undefined || self.selectedRecords.length === 0) {
            return;
        }

        Ext.each(self.selectedRecords, function (record) {
            record = self.getStore().getById(record.id);
            if (!Ext.isEmpty(record)) {
                toSelect.push(record);
            }
        });

        self.getSelectionModel().selectRecords(toSelect);
    }
});
