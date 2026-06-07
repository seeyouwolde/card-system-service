package com.demo.travelcardsystem.entity;

import com.demo.travelcardsystem.constant.Zone;

import javax.persistence.CollectionTable;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Station {

    @Id
    private String name;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "station_zones",
            joinColumns = @JoinColumn(name = "station_name")
    )
    @Enumerated(EnumType.STRING)
    private Set<Zone> zones = new HashSet<>();

    public Station() {
    }

    public Station(String name, Set<Zone> zones) {
        this.name = name;
        this.zones = zones;
    }

    public String getName() {
        return name;
    }

    public Set<Zone> getZones() {
        return zones;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setZones(Set<Zone> zones) {
        this.zones = zones;
    }
}