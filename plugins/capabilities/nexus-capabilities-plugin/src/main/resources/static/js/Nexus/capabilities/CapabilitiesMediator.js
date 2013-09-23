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
        'Nexus.capabilities.Icons',
        'Nexus.capabilities.CapabilityStore',
        'Nexus.capabilities.CapabilityTypeStore'
    ],

    /**
     * @property
     */
    capabilityStore : undefined,

    /**
     * @property
     */
    capabilityTypeStore : undefined,

    /**
    * @constructor
    */
    constructor: function () {
        var self = this;

        self.capabilityStore = NX.create('Nexus.capabilities.CapabilityStore');
        self.capabilityTypeStore = NX.create('Nexus.capabilities.CapabilityTypeStore');
    },

    /**
     * Updates a capability via REST.
     */
    updateCapability: function(capability, successHandler, failureHandler) {
        var self = this;

        self.logDebug('Saving capability');

        Ext.Ajax.request({
            url: self.capabilityStore.urlOf(capability.id),
            method: 'PUT',
            scope: self,
            suppressStatus: 400,
            jsonData: capability,
            success: successHandler,
            failure: failureHandler
        });
    },

    /**
     * Enables a capability via REST.
     */
    enableCapability: function (capability, successHandler, failureHandler) {
        var self = this;

        Ext.Ajax.request({
              url: self.capabilityStore.urlOf(capability.id) + "/enable",
              method: 'PUT',
              callback: self.refresh(),
              scope: self,
              success: successHandler,
              failure: failureHandler
        });
    },

    /**
     * Disables a capability via REST.
     */
    disableCapability: function (capability, successHandler, failureHandler) {
        var self = this;

        Ext.Ajax.request({
              url: self.capabilityStore.urlOf(capability.id) + "/disable",
              method: 'PUT',
              callback: self.refresh(),
              scope: self,
              success: successHandler,
              failure: failureHandler
        });
    },

    /**
     * Deletes a capability via REST.
     */
    deleteCapability: function (capability, successHandler, failureHandler) {
        var self = this;

        Ext.Ajax.request({
              url: self.capabilityStore.urlOf(capability.id),
              method: 'DELETE',
              scope: self,
              success: successHandler,
              failure: failureHandler
        });
    },

    /**
     * Returns a description of capability suitable to be displayed.
     */
    describeCapability: function(capability) {
        var description = capability.typeName;
        if (capability.description) {
            description += ' - ' + capability.description;
        }
        return description;
    },

    /**
     * Shows a message.
     */
    showMessage: function(title, message) {
         Nexus.messages.show(title,message);
    },

    /**
     * Refreshes data stores.
     */
    refresh: function () {
        var self = this;

        self.logDebug('Refreshing');

        self.capabilityStore.reload();
        self.capabilityTypeStore.reload();
    }

});