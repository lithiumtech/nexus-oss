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
 * 'combo' factory.
 *
 * @since 2.7
 */
NX.define('Nexus.capabilities.factory.ComboFactory', {

    //requires: [
    //    'Ext.data.JsonStore'
    //],

    supports: ['combobox','repo','repo-or-group','repo-target'],

    stores: {},

    create : function(formField) {
      var self = this,
          ST = Ext.data.SortTypes,
          item =  {
              xtype : 'combo',
              fieldLabel : formField.label,
              itemCls : formField.required ? 'required-field' : '',
              helpText : formField.helpText,
              name : formField.id,
              displayField : 'name',
              valueField : 'id',
              editable : false,
              forceSelection : true,
              mode : 'local',
              triggerAction : 'all',
              emptyText : 'Select...',
              selectOnFocus : true,
              allowBlank : formField.required ? false : true,
              anchor: '98%'
      };
      if (formField.initialValue) {
        item.value = formField.initialValue;
      };
      if (formField.storePath) {
        var store = self.stores[formField.storePath];
        if (!store) {
            var store = NX.create('Ext.data.JsonStore', {
               url: Sonatype.config.contextPath + formField.storePath,
               id: formField.idMapping ? formField.idMapping : 'id',

               fields: [
                  { name: 'id', mapping: formField.idMapping ? formField.idMapping : 'id' },
                  { name: 'name', mapping: formField.nameMapping ? formField.nameMapping : 'name', sortType : ST.asUCString },
               ],

               sortInfo : {
                 field : 'name',
                 direction : 'ASC'
               },

               autoLoad : true
            });
            self.stores[formField.storePath] = store;
        }
        item.store = store;
      }
      return item;
    }

});