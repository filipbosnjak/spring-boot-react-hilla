package com.example.application.endpoints.reports;

import com.example.application.entity.User;
import com.example.application.repository.UserRepository;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.engine.export.ooxml.JRXlsxExporter;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import net.sf.jasperreports.export.SimpleExporterInput;


import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
public class ReportsController {

    private static final Logger LOG = LoggerFactory.getLogger(ReportsController.class);

    private final JasperReport compiledReport = compileReport();
    private final UserRepository userRepository;

    public ReportsController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping(value = "/pdf-report", produces = {"application/octet-stream", "application/json"})
    public ResponseEntity<byte[]> generatePdfReport() {
        List<User> users = userRepository.findAll();
        JRBeanCollectionDataSource ds = new JRBeanCollectionDataSource(users);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report.pdf");

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        try {
            JasperPrint jasperPrint = JasperFillManager.fillReport(compiledReport, null, ds);
            // PDF exporter
            JRPdfExporter pdfExporter = new JRPdfExporter();

            // Set input i.e. the compiled template with data (params and ds)
            pdfExporter.setExporterInput(new SimpleExporterInput(jasperPrint));

            // Set export output -
            pdfExporter.setExporterOutput(new SimpleOutputStreamExporterOutput(byteArrayOutputStream));

            pdfExporter.exportReport();

        } catch (JRException e) {
            throw new RuntimeException(e);
        }

        return ResponseEntity
                .status(HttpStatus.OK)
                .headers(headers)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(byteArrayOutputStream.toByteArray());

    }

    @GetMapping(value = "/xlsx-report", produces = {"application/octet-stream", "application/json"})
    public ResponseEntity<byte[]> generateXlsxReport() {
        List<User> users = userRepository.findAll();
        JRBeanCollectionDataSource ds = new JRBeanCollectionDataSource(users);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report.xlsx");

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        try {
            JasperPrint jasperPrint = JasperFillManager.fillReport(compiledReport, null, ds);
            // PDF exporter
            JRXlsxExporter xlsxExporter = new JRXlsxExporter();

            // Set input i.e. the compiled template with data (params and ds)
            xlsxExporter.setExporterInput(new SimpleExporterInput(jasperPrint));

            // Set export output -
            xlsxExporter.setExporterOutput(new SimpleOutputStreamExporterOutput(byteArrayOutputStream));

            xlsxExporter.exportReport();

        } catch (JRException e) {
            throw new RuntimeException(e);
        }

        return ResponseEntity
                .status(HttpStatus.OK)
                .headers(headers)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(byteArrayOutputStream.toByteArray());

    }
    private JasperReport compileReport() {
        try {
            LOG.info("Compiling report template");
            return JasperCompileManager.compileReport(new ClassPathResource("report-templates/template.jrxml").getInputStream());
        } catch (JRException | IOException e) {
            throw new RuntimeException(e);
        }

    }
}
