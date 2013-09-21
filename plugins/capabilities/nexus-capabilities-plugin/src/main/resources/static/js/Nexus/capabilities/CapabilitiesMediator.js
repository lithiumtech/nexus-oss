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
        'Nexus.capabilities.Icons',
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
        var self = this;

        self.capabilityStore = NX.create('Nexus.capabilities.CapabilityStore');
        self.capabilityTypeStore = NX.create('Nexus.capabilities.CapabilityTypeStore');
    },

    refreshHandler: function () {
        var self = this;

        self.logDebug('Refreshing');

        self.capabilityStore.reload();
        self.capabilityTypeStore.reload();
    },

    deleteHandler: function (capability) {
        var self = this;

        if (capability) {}
            description = capability.description ? ' - ' + capability.description : '';

            Sonatype.utils.defaultToNo();
            Sonatype.MessageBox.show({
                //animEl : this.capabilitiesGridPanel.getEl(),
                title : 'Delete Capability?',
                msg : 'Delete the "' + capability.typeName + description + '" capability?',
                buttons : Sonatype.MessageBox.YESNO,
                scope : this,
                icon : Sonatype.MessageBox.QUESTION,
                fn : function(btnName) {
                    if (btnName === 'yes' || btnName === 'ok') {
                        Ext.Ajax.request({
                              callback : self.refreshHandler,
                              scope : self,
                              method : 'DELETE',
                              url : capability.url
                        });
                    }
                }
            });
    },

    enableHandler: function (capability) {
        var self = this;

        if (capability) {
            Ext.Ajax.request({
                  callback : self.refreshHandler,
                  scope : self,
                  method : 'PUT',
                  url : capability.url + "/enable"
            });
         }
    },

    disableHandler: function (capability) {
        var self = this;

        if (capability) {
            Ext.Ajax.request({
                  callback : self.refreshHandler,
                  scope : self,
                  method : 'PUT',
                  url : capability.url + "/disable"
            });
         }
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