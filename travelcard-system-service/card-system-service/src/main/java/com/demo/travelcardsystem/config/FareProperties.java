package com.demo.travelcardsystem.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "fare")
public class FareProperties {
    private double zoneOne;
    private double oneZoneOutsideZoneOne;
    private double twoZonesIncludingZoneOne;
    private double twoZonesExcludingZoneOne;
    private double threeZones;
    private double bus;
    private double maximum;
}