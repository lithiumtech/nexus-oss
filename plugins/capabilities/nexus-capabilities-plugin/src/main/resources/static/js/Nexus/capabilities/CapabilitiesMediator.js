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
    * @constructor
    */
    constructor: function () {
        var self = this;

        self.capabilityStore = NX.create('Nexus.capabilities.CapabilityStore');
        self.capabilityTypeStore = NX.create('Nexus.capabilities.CapabilityTypeStore');
    },

    updateCapability : function(capability, successHandler, failureHandler) {
        var self = this;

        self.logDebug('Saving capability');

        Ext.Ajax.request({
            url: self.capabilityStore.urlOf(capability.id),
            method: 'PUT',
            scope: self,
            suppressStatus: 400,
            jsonData: capability,
            success : successHandler,
            failure: failureHandler
        });
    },

    enableCapability: function (capability, successHandler, failureHandler) {
        var self = this;

        Ext.Ajax.request({
              url: self.capabilityStore.urlOf(capability.id) + "/enable",
              method : 'PUT',
              callback : self.refresh(),
              scope : self,
              success : successHandler,
              failure: failureHandler
        });
    },

    disableCapability: function (capability, successHandler, failureHandler) {
        var self = this;

        Ext.Ajax.request({
              url: self.capabilityStore.urlOf(capability.id) + "/disable",
              method : 'PUT',
              callback : self.refresh(),
              scope : self,
              success : successHandler,
              failure: failureHandler
        });
    },

    deleteCapability: function (capability, successHandler, failureHandler) {
        var self = this;

        Ext.Ajax.request({
              url: self.capabilityStore.urlOf(capability.id),
              method : 'DELETE',
              scope : self,
              success : successHandler,
              failure: failureHandler
        });
    },

    describeCapability : function(capability) {
        var description = capability.typeName;
        if (capability.description) {
            description += ' - ' + capability.description;
        }
        return description;
    },

    showMessage : function(title, message) {
         Nexus.messages.show(title,message);
    },

    refresh: function () {
        var self = this;

        self.logDebug('Refreshing');

        self.capabilityStore.reload();
        self.capabilityTypeStore.reload();
    },

    iconFor: function(capability) {
        var icons = Nexus.capabilities.Icons,
            typeName = capability.typeName,
            enabled = capability.enabled,
            active = capability.active,
            error = capability.error,
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
        return icons.get(iconName);
    }

});