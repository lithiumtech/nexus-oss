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
 * Capability Type View.
 *
 * @since 2.7
 */
NX.define('Nexus.capabilities.CapabilitySummary', {
    extend: 'Ext.FormPanel',

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
        var self = this,
            mediator = Nexus.capabilities.CapabilitiesMediator;

        self.enabled = {
           xtype: 'checkbox',
           fieldLabel: 'Enabled',
           helpText: 'This flag determines if the capability is currently enabled. To disable this capability for a period of time, de-select this checkbox.',
           name: 'enabled',
           allowBlank: false,
           checked: true,
           editable: true
        };

        self.settings = {
            xtype: 'fieldset',
            title : 'Settings',
            autoHeight: false,
            autoScroll: true,
            collapsed: false,
            anchor: '100% 50%',
            labelWidth: 175,
            items: []
        };

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
            items: [{
                xtype: 'fieldset',
                autoHeight: true,
                collapsed: false,
                border: false,
                items: [{
                    xtype: 'displayfield',
                    fieldLabel: 'Type',
                    itemCls: '',
                    name: 'typeName'
                }, {
                    xtype: 'displayfield',
                    htmlDecode: true,
                    fieldLabel: 'Description',
                    itemCls: '',
                    name: 'description'
                }, {
                   xtype: 'displayfield',
                   htmlDecode: true,
                   fieldLabel: 'State',
                   itemCls: '',
                   name: 'stateDescription'
                }]
            },
                self.settings
            , {
                xtype: 'fieldset',
                title : 'Notes',
                autoHeight: true,
                collapsed: false,
                hideLabels: true,
                items: [{
                    xtype: 'textarea',
                    htmlDecode: true,
                    helpText: "Optional notes about configured capability",
                    name: 'notes',
                    anchor: '96%',
                    allowBlank: true,
                    editable: true
                }]
            }],

            buttonAlign: 'left',
            buttons: [
                {
                    text: 'Save',
                    formBind: true,
                    scope: self,
                    handler: self.updateCapability
                },
                {
                    xtype: 'link-button',
                    text: 'Discard',
                    formBind: false,
                    scope: self,
                    handler: function() {
                        self.setValues(self.currentRecord);
                    }
                }
            ]
        });

        self.constructor.superclass.initComponent.apply(self, arguments);

        self.settingsCmp = self.getComponent(1);

        self.factories = NX.create('Ext.util.MixedCollection');
        self.addFactory('Nexus.capabilities.factory.CheckboxFactory');
        self.addFactory('Nexus.capabilities.factory.ComboFactory');
        self.addFactory('Nexus.capabilities.factory.DateFieldFactory');
        self.addFactory('Nexus.capabilities.factory.NumberFieldFactory');
        self.addFactory('Nexus.capabilities.factory.TextAreaFactory');
        self.addFactory('Nexus.capabilities.factory.TextFieldFactory');
    },

    /**
     * Update the capability record.
     *
     * @param capability
     */
    updateRecord: function (capability) {
        var self = this,
            sp = Sonatype.lib.Permissions,
            editable = sp.checkPermission('nexus:capabilities', sp.EDIT),
            mediator = Nexus.capabilities.CapabilitiesMediator,
            capabilityType = mediator.capabilityTypeStore.getTypeById(capability.typeId);

        this.currentRecord = capability;

        self.removeFields();
        if (capabilityType) {
            self.createFields(capabilityType);
        }
        self.doLayout();
        self.setValues(capability);
        self.togglePermission(self.items, editable);
    },

    setValues: function (capability) {
        var self = this,
            formObject = Ext.apply({},capability),
            mediator = Nexus.capabilities.CapabilitiesMediator,
            capabilityType = mediator.capabilityTypeStore.getTypeById(capability.typeId);

        if (capabilityType.formFields) {
            Ext.each(capabilityType.formFields,function(formField) {
                formObject['property.' + formField.id] = '';
            });
        }

        if (capability.properties) {
            Ext.each(capability.properties,function(property) {
                formObject['property.' + property.key] = property.value;
            });
        }

        self.getForm().setValues(formObject);
    },

    togglePermission: function (items, enabled) {
      var self = this;

      if (items) {
          var iterable = items.items;
          if (!iterable) {
              iterable = items;
          }
          Ext.each(iterable, function(item) {
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
    },

    addFactory: function (factoryName) {
      var self = this,
          factory = NX.create(factoryName);

      Ext.each(factory.supports, function(supported){
          self.factories.add(supported, factory);
      });
    },

    removeFields: function () {
        var self = this;

        self.settingsCmp.removeAll();
        self.settings.items = [];
    },

    createFields: function (capabilityType) {
       var self = this;

       if (capabilityType.formFields) {
          self.settings.items[0] = self.enabled;
          Ext.each(capabilityType.formFields, function(formField) {
              var factory = self.factories.get(formField.type);
              if (!factory) {
                  factory = self.factories.get('string');
              }
              if (factory) {
                  var item = Ext.apply(factory.create(formField),{
                      editable: true,
                      name: 'property.' + formField.id,
                      factory: factory
                  });
                  self.settings.items[self.settings.items.length] = item;
              }
          });
          Ext.each(self.settings.items, function(item) {
              self.settingsCmp.add(item);
          });
       }
    }

});