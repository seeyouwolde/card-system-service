package com.demo.travelcardsystem;

import com.demo.travelcardsystem.config.FareProperties;
import com.demo.travelcardsystem.config.TravelcardsystemApplication;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = {TravelcardsystemApplication.class})
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application.properties", properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE",
        "spring.datasource.driverClassName=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
        "spring.jpa.hibernate.ddl-auto=update"
})
@ActiveProfiles("test") // Activate a test profile
@EnableConfigurationProperties(FareProperties.class)
public abstract class IntegrationTest {
}
