package com.demo.travelcardsystem;

import com.demo.travelcardsystem.config.FareProperties;
import com.demo.travelcardsystem.config.TravelcardsystemApplication;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = {TravelcardsystemApplication.class})
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application.properties")
@EnableConfigurationProperties(FareProperties.class) // Add this line
public abstract class IntegrationTest {
}
