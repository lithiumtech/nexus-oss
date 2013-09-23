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
/*global NX, Ext, Nexus*/

/**
 * Capability detail view.
 *
 * @since 2.7
 */
NX.define('Nexus.capabilities.CapabilityView', {
    extend: 'Ext.Panel',

    mixins: [
        'Nexus.LogAwareMixin'
    ],

    requires: [
        'Nexus.capabilities.Icons',
        'Nexus.capabilities.CapabilitySummary',
        'Nexus.capabilities.CapabilityStatus',
        'Nexus.capabilities.CapabilityAbout'
    ],

    /**
     * @override
     */
    initComponent: function () {
        var self = this,
            icons = Nexus.capabilities.Icons;

        self.summaryView = NX.create('Nexus.capabilities.CapabilitySummary');
        self.statusView = NX.create('Nexus.capabilities.CapabilityStatus');
        self.aboutView = NX.create('Nexus.capabilities.CapabilityAbout');

        self.allViews = [
            self.summaryView,
            self.statusView,
            self.aboutView
        ];

        self.tabPanel = NX.create('Ext.TabPanel', {
            title: 'Capability',
            iconCls: icons.get('capability'),
            items: self.allViews,
            activeTab: 0,
            layoutOnTabChange: true
        });

        Ext.apply(self, {
            cls: 'nx-capabilities-CapabilityView',
            header: true,
            border: false,
            layout: 'fit',

            items: self.tabPanel
        });

        self.constructor.superclass.initComponent.apply(self, arguments);
    },

    /**
     * Update the capability record.
     *
     * @param capability
     */
    updateRecord: function (capability) {
        var self = this,
            icons = Nexus.capabilities.Icons,
            mediator = Nexus.capabilities.CapabilitiesMediator;

        self.setTitle(mediator.describeCapability(capability), icons.iconFor(capability).cls);

        self.summaryView.updateRecord(capability);
        self.statusView.updateRecord(capability);
        self.aboutView.updateRecord(capability);
    }

});