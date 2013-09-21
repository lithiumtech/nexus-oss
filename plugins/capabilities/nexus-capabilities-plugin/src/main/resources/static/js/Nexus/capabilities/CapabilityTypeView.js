/*
 * Copyright (c) 2008-2013 Sonatype, Inc.
 *
 * All rights reserved. Includes the third-party code listed at http://links.sonatype.com/products/nexus/pro/attributions
 * Sonatype and Sonatype Nexus are trademarks of Sonatype, Inc. Apache Maven is a trademark of the Apache Foundation.
 * M2Eclipse is a trademark of the Eclipse Foundation. All other trademarks are the property of their respective owners.
 */
/*global NX, Ext, Nexus*/

/**
 * Capability Type View.
 *
 * @since 2.7
 */
NX.define('Nexus.capabilities.CapabilityTypeView', {
    extend: 'Ext.Panel',

    mixins: [
        'Nexus.LogAwareMixin'
    ],

    /**
     * @override
     */
    initComponent: function () {
        var self = this;

        Ext.apply(self, {
            cls: 'nx-capabilities-CapabilityTypeView',
            layout: 'border',
            hideMode: 'offsets',
            items: [{
                xtype : 'checkbox',
                fieldLabel : 'Enabled',
                labelStyle : 'margin-left: 15px; width: 60px',
                helpText : 'This flag determines if the capability is currently enabled. To disable this capability for a period of time, de-select this checkbox.',
                name : 'enabled',
                allowBlank : false,
                checked : true
            }, {
                xtype : 'checkbox',
                fieldLabel : 'Active',
                labelStyle : 'margin-left: 15px; width: 60px',
                helpText : 'Shows if the capability is current active or not. If not active, a text will be displayed explaining why.',
                name : 'active',
                allowBlank : false,
                checked : false,
                disabled : true
            }]
        });

        self.constructor.superclass.initComponent.apply(self, arguments);
    },

    /**
     * Update the capability record.
     *
     * @param repo
     */
    updateRecord: function (capability) {
        var self = this;

    }

});