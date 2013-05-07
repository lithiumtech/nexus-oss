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
package org.sonatype.nexus.proxy.item;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

public class ByteArrayContentLocator
    implements ContentLocator
{
    private final byte[] content;

    private final String mimeType;

    public ByteArrayContentLocator( final byte[] content, final String mimeType )
    {
        this.content = Arrays.copyOf( content, content.length );

        this.mimeType = mimeType;
    }

    @Override
    public InputStream getContent()
        throws IOException
    {
        return new ByteArrayInputStream( content );
    }

    @Override
    public String getMimeType()
    {
        return mimeType;
    }

    @Override
    public boolean isReusable()
    {
        return true;
    }

    public long getLength()
    {
        return content.length;
    }

    public byte[] getByteArray()
    {
        return content;
    }
}
