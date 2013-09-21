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
        'Nexus.capabilities.CapabilityTypeView',
        'Nexus.capabilities.CapabilityStatusView'
    ],

    /**
     * @override
     */
    initComponent: function () {
        var self = this;

        self.capabilityTypeView = NX.create('Nexus.capabilities.CapabilityTypeView');
        self.capabilityStatusView = NX.create('Nexus.capabilities.CapabilityStatusView');

        Ext.apply(self, {
            cls: 'nx-capabilities-CapabilityView',
            title: 'Capability',
            border: false,
            autoScroll : true,
            items: [
                self.capabilityTypeView,
                self.capabilityStatusView
            ]
        });

        self.constructor.superclass.initComponent.apply(self, arguments);

        // propagate 'hide' and 'deactivate' events to child views, 'show' and 'activate' handled when [re-]enabling views
        self.on('deactivate', function(panel) {
            self.capabilityTypeView.fireEvent('deactivate', self.capabilityTypeView);
            self.capabilityStatusView.fireEvent('deactivate', self.capabilityStatusView);
        });
        self.on('hide', function(panel) {
            self.capabilityTypeView.fireEvent('hide', self.capabilityTypeView);
            self.capabilityStatusView.fireEvent('hide', self.capabilityStatusView);
        });

    },

    updateRecord: function (capability) {
        var self = this,
            mediator = Nexus.capabilities.CapabilitiesMediator,
            title = capability.typeName;

        if (!capability.active && capability.stateDescription) {
            title += ' (inactive because ';
            if (!capability.enabled) {
                title += 'has been disabled'
            }
            else {
                title +=  capability.stateDescription;
            }
            title += ')';
         }
        self.setTitle(title, mediator.iconFor(capability).cls);

        self.capabilityTypeView.updateRecord(capability);
        self.capabilityStatusView.updateRecord(capability);
    }

});