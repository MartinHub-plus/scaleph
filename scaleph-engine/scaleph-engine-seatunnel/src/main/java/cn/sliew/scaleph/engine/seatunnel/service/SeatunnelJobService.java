package cn.sliew.scaleph.engine.seatunnel.service;

import cn.sliew.scaleph.core.di.service.dto.DiJobDTO;
import org.apache.flink.configuration.Configuration;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.Map;

public interface SeatunnelJobService {

    DiJobDTO queryJobInfo(Long jobId);

    void submit(DiJobDTO diJobDTO) throws Exception;

    void schedule(DiJobDTO diJobDTO) throws Exception;

    void cancel(Long jobId) throws Exception;

    Path buildConfFile(DiJobDTO diJobDTO, Path projectPath) throws IOException;

    Path getSeatunnelJar() throws IOException;

    Configuration buildConfiguration(DiJobDTO job, Path seatunnelJarPath,
                                     Map<String, String> clusterConf,
                                     File projectPath) throws IOException;
}