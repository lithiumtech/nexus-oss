/*
 * Sonatype Nexus (TM) Open Source Version
 * Copyright (c) 2007-2013 Sonatype, Inc.
 * All rights reserved. Includes the third-party code listed at http://links.sonatype.com/products/nexus/oss/attributions.
 *
 * This program and the accompanying materials are made available under the terms of the Eclipse Public License Version 1.0,
 * which accompanies this distribution and is available at http://www.eclipse.org/legal/epl-v10.html.
 *
 * Sonatype Nexus (TM) Professional Version is available from Sonatype, Inc. "Sonatype" and "Sonatype Nexus" are trademarks
 * of Sonatype, Inc. Apache Maven is a trademark of the Apache Software Foundation. M2eclipse is a trademark of the
 * Eclipse Foundation. All other trademarks are the property of their respective owners.
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
        };

        // FIXME: This does not appear to function
        self.emptyText = 'No capabilities';

        self.viewConfig = {
            emptyText : 'Click "Add" to configure a capability.',
            deferEmptyText: false
        };

        self.stripeRows = true;

        self.sm = NX.create('Ext.grid.RowSelectionModel', {
            singleSelect: true,
            listeners: {
                selectionchange: {
                    fn: self.selectionChanged,
                    scope: self
                }
            }
        });

        var columns = [
            // icon
            {
                width: 30,
                resizable: false,
                sortable: false,
                fixed: true,
                hideable: false,
                menuDisabled: true,
                renderer: function (value, metaData, record) {
                    return mediator.iconFor(record.data).img;
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
                    selections = self.getSelectionModel().getSelections();
                    if (selections.length > 0) {
                        mediator.deleteHandler(selections[0].data);
                    }
                },
                disabled: true
            },
            {
                text: 'Enable',
                itemId: 'enable',
                iconCls: icons.get('enable').cls,
                tooltip: 'Enable selected capability',
                handler: function () {
                    selections = self.getSelectionModel().getSelections();
                    if (selections.length > 0) {
                        mediator.enableCapability(selections[0].data,
                            function() {
                                mediator.showMessage('Capability enabled', mediator.describeCapability(selections[0].data));
                            }
                        );
                    }
                },
                disabled: true
            },
            {
                text: 'Disable',
                itemId: 'disable',
                iconCls: icons.get('disable').cls,
                tooltip: 'Disable selected capability',
                handler: function () {
                    selections = self.getSelectionModel().getSelections();
                    if (selections.length > 0) {
                        mediator.disableCapability(selections[0].data,
                            function() {
                                mediator.showMessage('Capability disabled', mediator.describeCapability(selections[0].data));
                            }
                        );
                    }
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
            sp = Sonatype.lib.Permissions,
            deleteButton = self.getTopToolbar().getComponent('delete'),
            enableButton = self.getTopToolbar().getComponent('enable'),
            disableButton = self.getTopToolbar().getComponent('disable');

        deleteButton.disable();
        enableButton.disable();
        disableButton.disable();

        if (sm.getCount() !== 0) {
            if (sp.checkPermission('nexus:capabilities', sp.DELETE)) {
                deleteButton.enable();
            }
            capability = sm.selections.items[0].data;
            if (sp.checkPermission('nexus:capabilities', sp.EDIT)) {
                if (capability.enabled) {
                    disableButton.enable();
                }
                else {
                    enableButton.enable();
                }
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
