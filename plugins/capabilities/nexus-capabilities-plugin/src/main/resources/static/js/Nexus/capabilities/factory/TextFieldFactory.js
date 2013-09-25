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
/*global NX*/

/**
 * 'textfield' factory.
 *
 * @since 2.7
 */
NX.define('Nexus.capabilities.factory.TextFieldFactory', {

  singleton: true,

  supports: ['textfield', 'string', 'password'],

  /**
   * Creates a textfield.
   * @param formField capability type form field to create textfield for
   * @returns {*} created textfield (never null)
   */
  create: function (formField) {
    var item = {
      xtype: 'textfield',
      htmlDecode: true,
      fieldLabel: formField.label,
      itemCls: formField.required ? 'required-field' : '',
      helpText: formField.helpText,
      allowBlank: formField.required ? false : true,
      regex: formField.regexValidation ? new RegExp(formField.regexValidation) : null,
      anchor: '96%'
    };
    if (formField.type === 'password') {
      item.inputType = 'password';
    }
    if (formField.initialValue) {
      item.value = formField.initialValue;
    }
    return item;
  }

});