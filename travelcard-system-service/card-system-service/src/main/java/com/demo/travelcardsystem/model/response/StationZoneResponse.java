package com.demo.travelcardsystem.model.response;

import com.demo.travelcardsystem.constant.Zone;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Set;

@Data
@AllArgsConstructor
public class StationZoneResponse {
    private String stationName;
    private Set<Zone> zones;
}