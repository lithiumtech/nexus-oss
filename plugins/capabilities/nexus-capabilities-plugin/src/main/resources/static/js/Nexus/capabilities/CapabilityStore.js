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
 * Capability data store.
 *
 * @since 2.7
 */
NX.define('Nexus.capabilities.CapabilityStore', {
  extend: 'Ext.data.JsonStore',

  requires: [ 'Nexus.siesta' ],

  // FIXME: Is this needed as a field?
  /**
   * @property {String}
   * URL of capability store.
   */
  url: undefined,

  /**
   * @constructor
   */
  constructor: function (config) {
    var self = this,
        config = config || {},
        ST = Ext.data.SortTypes;

    self.url = Nexus.siesta.basePath + '/capabilities';

    Ext.apply(config, {
      url: self.url,
      id: 'capability.id',

      fields: [
        { name: 'id', mapping: 'capability.id' },
        { name: 'description', sortType: ST.asUCString },
        { name: 'notes', mapping: 'capability.notes', sortType: ST.asUCString },
        { name: 'enabled', mapping: 'capability.enabled' },
        { name: 'active' },
        { name: 'error' },
        { name: 'typeName' },
        { name: 'typeId', mapping: 'capability.typeId'},
        { name: 'stateDescription' },
        { name: 'status' },
        { name: 'properties', mapping: 'capability.properties' },
        { name: '$capability', mapping: 'capability' }
      ],

      sortInfo: {
        field: 'typeName',
        direction: 'ASC'
      }
    });

    self.constructor.superclass.constructor.call(self, config);
  },

  /**
   * Returns the url of a capability given its ID.
   */
  urlOf: function (id) {
    return this.url + '/' + id;
  }

});