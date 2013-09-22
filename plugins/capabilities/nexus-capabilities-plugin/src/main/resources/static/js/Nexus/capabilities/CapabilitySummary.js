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
        'Nexus.capabilities.CapabilitiesMediator'
    ],

    /**
     * @override
     */
    initComponent: function () {
        var self = this,
            mediator = Nexus.capabilities.CapabilitiesMediator;

        Ext.apply(self, {
            cls: 'nx-capabilities-CapabilitySummary',
            title: 'Summary',
            region: 'center',
            border: false,
            collapsible: false,
            collapsed: false,
            labelWidth: 75,
            layoutConfig: {
                labelSeparator: ''
            },
            items: {
                xtype: 'fieldset',
                autoHeight: true,
                collapsed: false,
                border: false,
                width: '400px',
                items: [{
                    xtype: 'checkbox',
                    fieldLabel: 'Enabled',
                    labelStyle: 'margin-left: 15px; width: 60px',
                    helpText: 'This flag determines if the capability is currently enabled. To disable this capability for a period of time, de-select this checkbox.',
                    name: 'enabled',
                    allowBlank: false,
                    checked: true
                }, {
                    xtype: 'checkbox',
                    fieldLabel: 'Active',
                    labelStyle: 'margin-left: 15px; width: 60px',
                    helpText: 'Shows if the capability is current active or not. If not active, a text will be displayed explaining why.',
                    name: 'active',
                    allowBlank: false,
                    checked: false,
                    disabled: true
                }, {
                    xtype: 'combo',
                    fieldLabel: 'Type',
                    labelStyle: 'margin-left: 15px; width: 60px',
                    itemCls: 'required-field',
                    helpText: "Type of configured capability",
                    name: 'typeId',
                    store: mediator.capabilityTypeStore,
                    displayField: 'name',
                    valueField: 'id',
                    editable: false,
                    forceSelection: true,
                    mode: 'local',
                    triggerAction: 'all',
                    emptyText: 'Select...',
                    selectOnFocus: true,
                    allowBlank: false,
                    width: 300
                }, {
                    xtype: 'textfield',
                    htmlDecode: true,
                    fieldLabel: 'Notes',
                    labelStyle: 'margin-left: 15px; width: 60px; margin-bottom:10px',
                    itemCls: '',
                    helpText: "Optional notes about configured capability",
                    name: 'notes',
                    width: 300,
                    allowBlank: true
                }]
            }
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

        self.getForm().setValues(capability);
    }

});