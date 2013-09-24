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
 * Capability Settings FieldSet.
 *
 * @since 2.7
 */
NX.define('Nexus.capabilities.CapabilitySettings', {
  extend: 'Ext.form.FieldSet',

  mixins: [
    'Nexus.LogAwareMixin',
    'Nexus.capabilities.CapabilitiesMediator',
    'Nexus.capabilities.factory.CheckboxFactory',
    'Nexus.capabilities.factory.ComboFactory',
    'Nexus.capabilities.factory.DateFieldFactory',
    'Nexus.capabilities.factory.NumberFieldFactory',
    'Nexus.capabilities.factory.TextAreaFactory',
    'Nexus.capabilities.factory.TextFieldFactory'
  ],

  /**
   * @override
   */
  initComponent: function () {
    var self = this;

    Ext.apply(self, {
      title: 'Settings',
      autoHeight: false,
      autoScroll: true,
      collapsed: false,
      anchor: '100% 80%',
      labelWidth: 175,
      items: []
    });

    self.constructor.superclass.initComponent.apply(self, arguments);

    self.factories = NX.create('Ext.util.MixedCollection');

    self.addFactory('Nexus.capabilities.factory.CheckboxFactory');
    self.addFactory('Nexus.capabilities.factory.ComboFactory');
    self.addFactory('Nexus.capabilities.factory.DateFieldFactory');
    self.addFactory('Nexus.capabilities.factory.NumberFieldFactory');
    self.addFactory('Nexus.capabilities.factory.TextAreaFactory');
    self.addFactory('Nexus.capabilities.factory.TextFieldFactory');
  },

  /**
   * @property
   */
  capabilityType: undefined,

  /**
   * Renders fields for a capability type.
   *
   * @param capabilityTypeId id of capability type to rendered
   */
  setCapabilityType: function (capabilityTypeId) {
    var self = this,
        mediator = Nexus.capabilities.CapabilitiesMediator;

    self.capabilityType = mediator.capabilityTypeStore.getTypeById(capabilityTypeId);

    self.removeAll();

    if (self.capabilityType) {
      self.add({
        xtype: 'checkbox',
        fieldLabel: 'Enabled',
        helpText: 'This flag determines if the capability is currently enabled. To disable this capability for a period of time, de-select this checkbox.',
        name: 'enabled',
        allowBlank: false,
        checked: true,
        editable: true
      });

      if (self.capabilityType.formFields) {
        Ext.each(self.capabilityType.formFields, function (formField) {
          var factory = self.factories.get(formField.type);
          if (!factory) {
            factory = self.factories.get('string');
          }
          if (factory) {
            var item = Ext.apply(factory.create(formField), {
              editable: true,
              name: 'property.' + formField.id,
              factory: factory
            });
            self.add(item);
          }
        });
      }

      self.add({
        xtype: 'textarea',
        fieldLabel: 'Notes',
        htmlDecode: true,
        helpText: "Optional notes about configured capability",
        name: 'notes',
        anchor: '96%',
        allowBlank: true,
        editable: true
      });
    }
  },

  exportCapability: function (form) {
    var self = this,
        values = form.getFieldValues();

    var capability = {
      typeId: self.capabilityType.id,
      enabled: values.enabled,
      notes: values.notes,
      properties: []
    };

    if (self.capabilityType && self.capabilityType.formFields) {
      Ext.each(self.capabilityType.formFields, function (formField) {
        var value = values['property.' + formField.id];
        if (value) {
          capability.properties[capability.properties.length] = {
            key: formField.id,
            value: String(value)
          };
        }
      });
    }

    return capability;
  },

  handleResponse: function (form, response) {
    if (response.siestaValidationError) {
      Ext.each(response.siestaValidationError, function (error) {
        var field = form.findField('property.' + error.id);
        if (!field) {
          field = form.findField(error.id);
        }
        if (field) {
          field.markInvalid(error.message);
        }
        else {
          // TODO show message box
        }
      });
      return false;
    }
    return true;
  },

  /**
   * @private
   */
  factories: undefined,

  /**
   * @private
   */
  addFactory: function (factoryName) {
    var self = this,
        factory = NX.create(factoryName);

    Ext.each(factory.supports, function (supported) {
      self.factories.add(supported, factory);
    });
  }

});