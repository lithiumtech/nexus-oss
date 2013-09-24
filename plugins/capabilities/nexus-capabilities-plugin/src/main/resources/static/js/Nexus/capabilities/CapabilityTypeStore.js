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
 * Capability type data store.
 *
 * @since 2.7
 */
NX.define('Nexus.capabilities.CapabilityTypeStore', {
  extend: 'Ext.data.JsonStore',

  requires: [ 'Nexus.siesta' ],

  // FIXME: Is this needed as a field?
  /**
   * @property {String}
   * URL of capability type store.
   */
  url: undefined,

  /**
   * @constructor
   */
  constructor: function (config) {
    var self = this,
        config = config || {},
        ST = Ext.data.SortTypes;

    self.url = Nexus.siesta.basePath + '/capabilities/types';

    Ext.apply(config, {
      url: self.url,
      id: 'id',

      fields: [
        { name: 'id' },
        { name: 'name' },
        { name: 'about' },
        { name: 'formFields' }
      ],

      sortInfo: {
        field: 'id',
        direction: 'ASC'
      }
    });

    self.constructor.superclass.constructor.call(self, config);
  },

  /**
   * Returns capability type given its ID.
   */
  getTypeById: function (id) {
    var record = this.getById(id);

    if (record) {
      return record.data;
    }
  }

});