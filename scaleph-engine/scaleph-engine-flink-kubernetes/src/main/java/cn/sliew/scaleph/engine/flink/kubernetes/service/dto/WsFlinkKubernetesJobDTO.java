/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package cn.sliew.scaleph.engine.flink.kubernetes.service.dto;

import cn.sliew.scaleph.common.dict.flink.FlinkJobType;
import cn.sliew.scaleph.common.dict.flink.FlinkRuntimeExecutionMode;
import cn.sliew.scaleph.common.dict.flink.kubernetes.DeploymentKind;
import cn.sliew.scaleph.dao.entity.master.ws.WsDiJob;
import cn.sliew.scaleph.dao.entity.master.ws.WsFlinkArtifactJar;
import cn.sliew.scaleph.dao.entity.master.ws.WsFlinkArtifactSql;
import cn.sliew.scaleph.system.model.BaseDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * <p>
 * flink kubernetes job
 * </p>
 */
@Data
@Schema(name = "WsFlinkKubernetesJob对象", description = "flink kubernetes job")
public class WsFlinkKubernetesJobDTO extends BaseDTO {

    @Schema(description = "project id")
    private Long projectId;

    @Schema(description = "name")
    private String name;

    @Schema(description = "job id")
    private String jobId;

    @Schema(description = "flink execution mode")
    private FlinkRuntimeExecutionMode executionMode;

    @Schema(description = "deployment kind")
    private DeploymentKind deploymentKind;

    @Schema(description = "flink deployment")
    private WsFlinkKubernetesDeploymentDTO flinkDeployment;

    @Schema(description = "flink session cluster")
    private WsFlinkKubernetesSessionClusterDTO flinkSessionCluster;

    @Schema(description = "type")
    private FlinkJobType type;

    @Schema(description = "flink artifact jar")
    private WsFlinkArtifactJar flinkArtifactJar;

    @Schema(description = "flink artifact sql")
    private WsFlinkArtifactSql flinkArtifactSql;

    @Schema(description = "ws di job")
    private WsDiJob wsDiJob;

    @Schema(description = "remark")
    private String remark;

}
