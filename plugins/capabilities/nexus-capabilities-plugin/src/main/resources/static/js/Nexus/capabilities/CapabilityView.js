/*
 * Copyright (c) 2008-2013 Sonatype, Inc.
 *
 * All rights reserved. Includes the third-party code listed at http://links.sonatype.com/products/nexus/pro/attributions
 * Sonatype and Sonatype Nexus are trademarks of Sonatype, Inc. Apache Maven is a trademark of the Apache Foundation.
 * M2Eclipse is a trademark of the Eclipse Foundation. All other trademarks are the property of their respective owners.
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
        'Nexus.capabilities.CapabilityTypeView'
    ],

    /**
     * @override
     */
    initComponent: function () {
        var self = this;

        self.capabilityTypeView = NX.create('Nexus.capabilities.CapabilityTypeView');

        self.panel = NX.create('Ext.Panel', {
            //layout: 'column',
            items: self.capabilityTypeView
        });

        Ext.apply(self, {
            cls: 'nx-capabilities-CapabilityView',
            title: 'Capability',
            header: true,
            border: false,
            //layout: 'fit',

            items: self.panel
        });

        self.constructor.superclass.initComponent.apply(self, arguments);

        // propagate 'hide' and 'deactivate' events to child views, 'show' and 'activate' handled when [re-]enabling views
        self.on('deactivate', function(panel) {
            self.capabilityTypeView.fireEvent('deactivate', self.capabilityTypeView);
        });
        self.on('hide', function(panel) {
            self.capabilityTypeView.fireEvent('hide', self.capabilityTypeView);
        });

    },

    updateRecord: function (capability) {
        var self = this,
            mediator = Nexus.capabilities.CapabilitiesMediator;

        self.setTitle(capability.typeName, mediator.iconFor(capability).cls);
        self.capabilityTypeView.updateRecord(capability);
        self.capabilityTypeView.fireEvent('show', self.capabilityTypeView);
    }

});