/*
 * Copyright (c) 2008-2013 Sonatype, Inc.
 *
 * All rights reserved. Includes the third-party code listed at http://links.sonatype.com/products/nexus/pro/attributions
 * Sonatype and Sonatype Nexus are trademarks of Sonatype, Inc. Apache Maven is a trademark of the Apache Foundation.
 * M2Eclipse is a trademark of the Eclipse Foundation. All other trademarks are the property of their respective owners.
 */
/*global NX, Ext, Nexus*/


/**
 * Capabilities master/detail view.
 *
 * @since 2.7
 */
NX.define('Nexus.capabilities.CapabilitiesView', {
    extend: 'Ext.Panel',

    mixins: [
        'Nexus.LogAwareMixin'
    ],

    requires: [
        'Nexus.capabilities.Icons',
        'Nexus.capabilities.CapabilitiesGrid',
        'Nexus.capabilities.CapabilityView',
        'Nexus.capabilities.CapabilitiesMediator'
    ],

    /**
     * @override
     */
    initComponent: function () {
        var self = this,
            icons = Nexus.capabilities.Icons,
            mediator = Nexus.capabilities.CapabilitiesMediator;

        // force all data stores to refresh when the main capabilities view loads
        mediator.refreshHandler();

        self.masterPanel = NX.create('Nexus.capabilities.CapabilitiesGrid', {
            region: 'center'
        });

        self.emptySelectionPanel = NX.create('Ext.Panel', {
            cls: 'nx-capabilities-CapabilitiesView-messagePanel',
            title: 'Empty Selection',
            iconCls: icons.get('selectionEmpty').cls,
            html: '<span class="nx-capabilities-CapabilitiesView-messagePanel-text">Please select a capability</span>'
        });

        self.capabilityView = NX.create('Nexus.capabilities.CapabilityView');

        self.detailPanel = NX.create('Ext.Panel', {
            region: 'south',
            minHeight: 25, // height of panel title
            split: true,
            autoDestroy: false,

            layout: 'card',
            defaults: {
                border: false
            },
            items: [
                self.emptySelectionPanel, // 0
                self.capabilityView       // 1
            ],
            activeItem: 0,
            listeners: {
                // resize detail panel height to 50% of parent on first render
                afterrender: {
                    single: true,
                    fn: function() {
                        self.detailPanel.setHeight(self.getHeight() / 2);
                    }
                }
            }
        });

        Ext.apply(self, {
            cls: 'nx-capabilities-CapabilitiesView',
            layout: 'border',
            items: [
                self.masterPanel,
                self.detailPanel
            ]
        });

        self.masterPanel.getSelectionModel().on('selectionchange', self.selectionChanged, self);

        self.constructor.superclass.initComponent.apply(self, arguments);
    },

    /**
     * Update detail panel when grid selection changes.
     *
     * @param sm    grid selection model
     *
     * @private
     */
    selectionChanged: function(sm) {
        var self = this,
            cardLayout = self.detailPanel.getLayout(),
            selections = sm.getSelections();

        self.logDebug('Selection changed:', selections.length);

        if (selections.length === 0) {
            cardLayout.setActiveItem(0); // empty-selection
        }
        else if (selections.length === 1) {
            cardLayout.setActiveItem(1);
            // update after layout changed, so that tabs can properly [un]hide
            self.capabilityView.updateRecord(selections[0].data);
        }
    }

}, function () {
    var type = this,
        sp = Sonatype.lib.Permissions;

    NX.log.debug('Adding global view: ' + type.$className);

    // install panel into main NX navigation
    Sonatype.Events.on('nexusNavigationInit', function (panel) {
        panel.add({
            enabled: sp.checkPermission('nexus:capabilities', sp.READ),
            sectionId: 'st-nexus-config',
            title: 'Capabilities',
            tabId: 'Capabilities',
            tabCode: type
        });

        NX.log.debug('Registered global view: ' + type.$className);
    });
});