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

package org.sonatype.nexus.testsuite.content;

import java.util.Collection;

import org.sonatype.nexus.bundle.launcher.NexusBundleConfiguration;
import org.sonatype.nexus.client.core.subsystem.content.Content;
import org.sonatype.nexus.testsuite.support.NexusRunningParametrizedITSupport;
import org.sonatype.nexus.testsuite.support.NexusStartAndStopStrategy;

import org.junit.runners.Parameterized;

import static org.sonatype.nexus.testsuite.support.ParametersLoaders.firstAvailableTestParameters;
import static org.sonatype.nexus.testsuite.support.ParametersLoaders.systemTestParameters;
import static org.sonatype.nexus.testsuite.support.ParametersLoaders.testParameters;
import static org.sonatype.sisu.goodies.common.Varargs.$;

/**
 * ITs related to content resource.
 *
 * @since 2.7.0
 */
@NexusStartAndStopStrategy(NexusStartAndStopStrategy.Strategy.EACH_TEST)
public class ContentITSupport
    extends NexusRunningParametrizedITSupport
{

  @Parameterized.Parameters
  public static Collection<Object[]> data() {
    return firstAvailableTestParameters(
        systemTestParameters(),
        testParameters(
            $("${it.nexus.bundle.groupId}:${it.nexus.bundle.artifactId}:zip:bundle")
        )
    ).load();
  }

  public ContentITSupport(final String nexusBundleCoordinates) {
    super(nexusBundleCoordinates);
  }

  @Override
  protected NexusBundleConfiguration configureNexus(final NexusBundleConfiguration configuration) {
    return configuration
.setLogLevel("org.sonatype.nexus.web", "TRACE").setLogLevel("org.sonatype.nexus", "DEBUG");
  }

  protected Content content() {
    return client().getSubsystem(Content.class);
  }

}
