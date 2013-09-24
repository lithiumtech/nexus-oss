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
 * Capability Summary View.
 *
 * @since 2.7
 */
NX.define('Nexus.capabilities.CapabilitySummary', {
  extend: 'Ext.FormPanel',

  mixins: [
    'Nexus.LogAwareMixin',
    'Nexus.capabilities.CapabilitiesMediator',
    'Nexus.capabilities.CapabilitySettings'
  ],

  /**
   * @override
   */
  initComponent: function () {
    var self = this;

    self.settings = NX.create('Nexus.capabilities.CapabilitySettings');

    Ext.apply(self, {
      cls: 'nx-capabilities-CapabilitySummary',
      title: 'Summary',
      region: 'center',
      border: false,
      collapsible: false,
      collapsed: false,
      layoutConfig: {
        labelSeparator: ''
      },
      items: [
        {
          xtype: 'fieldset',
          autoHeight: true,
          collapsed: false,
          border: false,
          items: [
            {
              xtype: 'displayfield',
              fieldLabel: 'Type',
              itemCls: '',
              name: 'typeName'
            },
            {
              xtype: 'displayfield',
              htmlDecode: true,
              fieldLabel: 'Description',
              itemCls: '',
              name: 'description'
            },
            {
              xtype: 'displayfield',
              htmlDecode: true,
              fieldLabel: 'State',
              itemCls: '',
              name: 'stateDescription'
            }
          ]
        },
        self.settings
      ],

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
            self.setValues(self.currentRecord);
          }
        }
      ]
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

    self.settings.setCapabilityType(capability.typeId);
    self.doLayout();
    self.setValues(capability);
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
        form = self.getForm();

    if (!form.isValid()) {
      return;
    }

    var capability = Ext.apply(self.settings.exportCapability(form), {id: capability.id });

    mediator.updateCapability(capability,
        function () {
          form.items.each(function (item) {
            item.clearInvalid();
          });
          mediator.showMessage('Capability saved', mediator.describeCapability(self.currentRecord));
          mediator.refresh();
        },
        function (response) {
          self.settings.handleResponse(form, response);
        }
    );
  },

  /**
   * @private
   */
  setValues: function (capability) {
    var self = this,
        formObject = Ext.apply({}, capability),
        mediator = Nexus.capabilities.CapabilitiesMediator,
        capabilityType = mediator.capabilityTypeStore.getTypeById(capability.typeId);

    if (capabilityType.formFields) {
      Ext.each(capabilityType.formFields, function (formField) {
        formObject['property.' + formField.id] = '';
      });
    }

    if (capability.properties) {
      Ext.each(capability.properties, function (property) {
        formObject['property.' + property.key] = property.value;
      });
    }

    self.getForm().setValues(formObject);
  },

  /**
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
          if (item.editable) {
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