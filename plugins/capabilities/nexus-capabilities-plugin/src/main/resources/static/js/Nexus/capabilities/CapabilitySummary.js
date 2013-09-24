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
    'Nexus.capabilities.CapabilitiesMediator'
  ],

  /**
   * @override
   */
  initComponent: function () {
    var self = this,
        sp = Sonatype.lib.Permissions,
        editable = sp.checkPermission('nexus:capabilities', sp.EDIT);

    Ext.apply(self, {
      cls: 'nx-capabilities-CapabilitySummary',
      title: 'Summary',
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
        {
          xtype: 'fieldset',
          title: 'Notes',
          autoScroll: true,
          collapsed: false,
          hideLabels: true,
          items: {
            xtype: 'textarea',
            htmlDecode: true,
            helpText: "Optional notes about configured capability",
            name: 'notes',
            anchor: '96%',
            allowBlank: true,
            disabled: !editable
          }
        }
      ],

      buttonAlign: 'left',
      buttons: [
        {
          text: 'Save',
          formBind: true,
          scope: self,
          handler: function () {
            self.updateCapability();
          }
        },
        {
          xtype: 'link-button',
          text: 'Discard',
          formBind: false,
          scope: self,
          handler: function () {
            self.updateRecord(self.currentRecord);
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
    var self = this;

    self.currentRecord = capability;
    self.getForm().setValues(capability);
  },

  /**
   * @private
   */
  currentRecord: undefined,

  /**
   * @private
   */
  updateCapability: function () {
    var self = this,
        mediator = Nexus.capabilities.CapabilitiesMediator,
        form = self.getForm(),
        values = form.getFieldValues();

    var capability = Ext.apply(self.currentRecord.$capability, {notes: values.notes});

    mediator.updateCapability(capability,
        function () {
          mediator.showMessage('Capability saved', mediator.describeCapability(self.currentRecord));
          mediator.refresh();
        },
        function (response) {
          // TODO handle errors
        }
    );
  }

});