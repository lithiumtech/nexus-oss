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
  extend: 'Ext.Panel',

  mixins: [
    'Nexus.LogAwareMixin',
    'Nexus.capabilities.CapabilitiesMediatorMixin'
  ],

  requires: [
    'Nexus.capabilities.Icons'
  ],

  /**
   * @override
   */
  initComponent: function () {
    var self = this,
        sp = Sonatype.lib.Permissions,
        editable = sp.checkPermission('nexus:capabilities', sp.EDIT);

    self.templatePanel = NX.create('Ext.Panel', {
      cls: 'nx-capabilities-CapabilitySummary-template',
      border: false
    });

    self.notesPanel = NX.create('Ext.FormPanel', {
      border: false,
      hideLabels: true,

      items: [
        {
          xtype: 'textarea',
          htmlDecode: true,
          helpText: "Optional notes about configured capability",
          name: 'notes',
          anchor: '-20px',
          allowBlank: true,
          disabled: !editable
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
            self.setCapability(self.currentRecord);
          }
        }
      ]
    });

    Ext.apply(self, {
      cls: 'nx-capabilities-CapabilitySummary',
      title: 'Summary',
      items: [
        self.templatePanel,
        {
          xtype: 'fieldset',
          title: 'Notes',
          autoScroll: true,
          collapsed: false,
          hideLabels: true,
          items: self.notesPanel
        }
      ]
    });

    self.initTemplate();

    self.constructor.superclass.initComponent.apply(self, arguments);
  },

  initTemplate: function () {
    var self = this,
        icons = Nexus.capabilities.Icons;

    self.mainTpl = NX.create('Ext.XTemplate',
        '<div class="nx-capabilities-CapabilitySummary-body">',
        '{[ this.status(values) ]}',
        '{[ this.properties(values) ]}',
        '{[ this.message(values) ]}',
        '</div>',
        {
          compiled: true,

          status: function (capability) {
            return self.statusTpl.apply(capability);
          },

          properties: function (capability) {
            var properties;

            properties = [
              { name: 'Type', value: capability.typeName },
            ];
            if (capability.description) {
              properties.push({ name: 'Description', value: capability.description });
            }

            return self.propertiesTpl.apply({
              properties: properties,
            })
          },

          message: function (capability) {
            if (capability.enabled && !capability.active) {
              return self.messageTpl.apply({
                icon: icons.get('warning').img,
                html: '<b>' + capability.stateDescription + '</b>.'
              });
            }
            return '';
          }
        });

    self.statusTpl = NX.create('Ext.XTemplate',
        '<div class="nx-capabilities-CapabilitySummary-status">',
        '<div class="nx-capabilities-CapabilitySummary-status-icon">',
        '{[ this.statusIcon(values) ]}',
        '</div>',
        '<div class="nx-capabilities-CapabilitySummary-status-label">',
        '{[ this.statusLabel(values) ]}',
        '</div>',
        '</div>',
        {
          compiled: true,

          statusIcon: function (capability) {
            return icons.iconFor(capability).variant('x32').img;
          },

          statusLabel: function (capability) {
            var enabled = capability.enabled,
                active = capability.active,
                error = capability.error

            if (enabled && error) {
              return 'Error';
            }
            else if (enabled && active) {
              return 'Active';
            }
            else if (enabled && !active) {
              return 'Passive';
            }
            else {
              return 'Disabled';
            }
          }
        });

    self.propertiesTpl = NX.create('Ext.XTemplate',
        '<div class="nx-capabilities-CapabilitySummary-properties">',
        '<table>',
        '<tpl for="properties">',
        '<tr class="nx-capabilities-CapabilitySummary-properties-entry">',
        '<td class="nx-capabilities-CapabilitySummary-properties-name">{name}</td>',
        '<td class="nx-capabilities-CapabilitySummary-properties-value">{value}</td>',
        '</tr>',
        '</tpl>',
        '</tr>',
        '</table>',
        '</div>',
        {
          compiled: true
        });

    self.messageTpl = NX.create('Ext.XTemplate',
        '<div class="nx-capabilities-CapabilitySummary-message">',
        '  <span>{icon}{html}</span>',
        '</div>',
        {
          compiled: true
        });
  },

  /**
   * Sets the current selected capability.
   * @param capability selected
   */
  setCapability: function (capability) {
    var self = this;

    self.currentRecord = capability;
    self.mainTpl.overwrite(self.templatePanel.body, capability);
    self.notesPanel.getForm().setValues(capability);
  },

  /**
   * @private
   */
  currentRecord: undefined,

  /**
   * Updates capability in Nexus.
   * @private
   */
  updateCapability: function () {
    var self = this,
        form = self.notesPanel.getForm(),
        values = form.getFieldValues();

    var capability = Ext.apply(self.currentRecord.$capability, {notes: values.notes});

     self.mediator().updateCapability(capability,
        function () {
           self.mediator().showMessage('Capability saved',  self.mediator().describeCapability(self.currentRecord));
           self.mediator().refresh();
        },
        function (response) {
           self.mediator().handleError(response, 'Capability could not be saved', form);
        }
    );
  }

});