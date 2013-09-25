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
 * Capability Settings View.
 *
 * @since 2.7
 */
NX.define('Nexus.capabilities.CapabilitySettings', {
  extend: 'Ext.Panel',

  mixins: [
    'Nexus.LogAwareMixin',
    'Nexus.capabilities.CapabilitiesMediator',
    'Nexus.capabilities.CapabilitySettingsFieldSet'
  ],

  /**
   * @override
   */
  initComponent: function () {
    var self = this;

    self.settings = NX.create('Nexus.capabilities.CapabilitySettingsFieldSet');

    self.formPanel = NX.create('Ext.FormPanel', {
      border: false,
      items: self.settings,
      buttonAlign: 'left',
      buttons: [
        {
          text: 'Save',
          formBind: true,
          scope: self,
          handler: function () {
            self.updateCapability(self.currentRecord);
          }
        },
        {
          xtype: 'link-button',
          text: 'Discard',
          formBind: false,
          scope: self,
          handler: function () {
            self.settings.importCapability(self.formPanel.getForm(), self.currentRecord);
          }
        }
      ]
    });

    Ext.apply(self, {
      cls: 'nx-capabilities-CapabilitySettings',
      title: 'Settings',
      items: self.formPanel,
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
        sp = Sonatype.lib.Permissions,
        editable = sp.checkPermission('nexus:capabilities', sp.EDIT);

    self.currentRecord = capability;
    self.settings.importCapability(self.formPanel.getForm(), capability);

    self.doLayout();
    self.togglePermission(self.items, editable);
  },

  /**
   * @private
   */
  currentRecord: undefined,

  /**
   * @private
   */
  settings: undefined,

  /**
   * @private
   */
  updateCapability: function (capability) {
    var self = this,
        mediator = Nexus.capabilities.CapabilitiesMediator,
        form = self.formPanel.getForm();

    if (!form.isValid()) {
      return;
    }

    var capability = Ext.apply(self.settings.exportCapability(form), {
      id: capability.id,
      notes: capability.notes
    });

    mediator.updateCapability(capability,
        function () {
          form.items.each(function (item) {
            item.clearInvalid();
          });
          mediator.showMessage('Capability saved', mediator.describeCapability(self.currentRecord));
          mediator.refresh();
        },
        function (response) {
          mediator.handleError(response, 'Capability could not be saved', form);
        }
    );
  },

  /**
   * Enables/disables fields marked with "requiresPermission".
   *
   * @private
   */
  togglePermission: function (items, enabled) {
    var self = this;

    if (items) {
      var iterable = items.items;
      if (!iterable) {
        iterable = items;
      }
      Ext.each(iterable, function (item) {
        if (item) {
          if (item.requiresPermission) {
            if (enabled) {
              item.enable();
            }
            else {
              item.disable();
            }
          }
          self.togglePermission(item.items, enabled)
        }
      });
    }
  }

});