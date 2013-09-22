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
                    name: 'type',
                }, {
                    xtype: 'displayfield',
                    htmlDecode: true,
                    fieldLabel: 'Description',
                    itemCls: '',
                    name: 'description',
                }, {
                   xtype: 'displayfield',
                   htmlDecode: true,
                   fieldLabel: 'State',
                   itemCls: '',
                   name: 'stateDescription',
                }]
            }, {
                xtype: 'fieldset',
                title : 'Settings',
                autoHeight: true,
                collapsed: false,
                items: [{
                    xtype: 'checkbox',
                    fieldLabel: 'Enabled',
                    helpText: 'This flag determines if the capability is currently enabled. To disable this capability for a period of time, de-select this checkbox.',
                    name: 'enabled',
                    allowBlank: false,
                    checked: true
                }]
            },{
                xtype: 'fieldset',
                title : 'Notes',
                autoHeight: true,
                collapsed: false,
                items: [{
                    xtype: 'textfield',
                    htmlDecode: true,
                    fieldLabel: 'Notes',
                    itemCls: '',
                    helpText: "Optional notes about configured capability",
                    name: 'notes',
                    width: 300,
                    allowBlank: true
                }]
            }            ]
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