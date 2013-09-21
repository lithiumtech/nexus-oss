/*
 * Copyright (c) 2008-2013 Sonatype, Inc.
 *
 * All rights reserved. Includes the third-party code listed at http://links.sonatype.com/products/nexus/pro/attributions
 * Sonatype and Sonatype Nexus are trademarks of Sonatype, Inc. Apache Maven is a trademark of the Apache Foundation.
 * M2Eclipse is a trademark of the Eclipse Foundation. All other trademarks are the property of their respective owners.
 */
/*global NX, Ext, Nexus*/

/**
 * Capability Status View.
 *
 * @since 2.7
 */
NX.define('Nexus.capabilities.CapabilityStatusView', {
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
            cls: 'nx-capabilities-CapabilityStatusView',
            layout: 'border',
            hideMode: 'offsets',
            items: [
            ]
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