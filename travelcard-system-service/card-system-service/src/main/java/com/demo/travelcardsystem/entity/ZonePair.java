package com.demo.travelcardsystem.entity;

import com.demo.travelcardsystem.constant.Zone;

public class ZonePair {

    private Zone startZone;
    private Zone endZone;

    public ZonePair() {
    }

    public ZonePair(Zone startZone, Zone endZone) {
        this.startZone = startZone;
        this.endZone = endZone;
    }

    public Zone getStartZone() {
        return startZone;
    }

    public Zone getEndZone() {
        return endZone;
    }

    public void setStartZone(Zone startZone) {
        this.startZone = startZone;
    }

    public void setEndZone(Zone endZone) {
        this.endZone = endZone;
    }

    public boolean checkIfJourneyMatchToThisZonePair(Journey journey) {
        return journey.getStartStation().getZones().contains(startZone)
                && journey.getEndStation().getZones().contains(endZone);
    }
}