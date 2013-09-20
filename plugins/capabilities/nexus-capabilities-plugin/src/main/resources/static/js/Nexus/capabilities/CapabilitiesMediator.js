/*
 * Copyright (c) 2008-2013 Sonatype, Inc.
 *
 * All rights reserved. Includes the third-party code listed at http://links.sonatype.com/products/nexus/pro/attributions
 * Sonatype and Sonatype Nexus are trademarks of Sonatype, Inc. Apache Maven is a trademark of the Apache Foundation.
 * M2Eclipse is a trademark of the Eclipse Foundation. All other trademarks are the property of their respective owners.
 */
/*global NX, Ext, Sonatype, Nexus*/

/**
 * Capabilities mediator.
 *
 * @since 2.7
 */
NX.define('Nexus.capabilities.CapabilitiesMediator', {
    extend: 'Ext.util.Observable',
    singleton: true,

    mixins: [
        'Nexus.LogAwareMixin'
    ],

    requires: [
        'Nexus.capabilities.CapabilityStore',
        'Nexus.capabilities.CapabilityTypeStore'
    ],

    /**
     * @constructor
     */
    constructor: function () {
        this.capabilityStore = NX.create('Nexus.capabilities.CapabilityStore');
        this.capabilityTypeStore = NX.create('Nexus.capabilities.CapabilityTypeStore');

        // provided centralized event management allowing for dynamic enhancement of UI's depending on this class
        this.addEvents(
            /**
             * Fires when repositoriesGrid columns are being defined.
             *
             * @event capabilities.capabilitiesGrid.configureColumns
             * @param {Array} Column configuration objects for Ext.grid.ColumnModel.
             */
            'capabilities.capabilitiesGrid.configureColumns'
        );
    },

    refreshHandler: function () {
        this.logDebug('Refreshing');

        this.capabilityStore.reload();
        this.capabilityTypeStore.reload();
    },

    deleteHandler: function (selected) {
        this.displayConfirmWindow('close', selected);
    }

});