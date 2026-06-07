package com.demo.travelcardsystem.businessrule;

import com.demo.travelcardsystem.config.FareProperties;
import com.demo.travelcardsystem.constant.TransportType;
import com.demo.travelcardsystem.constant.Zone;
import com.demo.travelcardsystem.entity.ZonePair;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Getter
@Component
@RequiredArgsConstructor
public class TravelStrategy {

    private final RuleCollection ruleCollection;
    private final FareProperties fareProperties;

    public RuleCollection loadAllBusinessRules() {
        System.out.println("FareProperties loaded: " + fareProperties); // Debug print
        addAnywhereInZoneOneRule(fareProperties.getZoneOne());
        addAnyOneZoneOutsideZoneOneRule(fareProperties.getOneZoneOutsideZoneOne());
        addAnyTwoZoneIncludingZoneOneRule(fareProperties.getTwoZonesIncludingZoneOne());
        addAnyTwoZoneExcludingZoneOneRule(fareProperties.getTwoZonesExcludingZoneOne());
        addAnyThreeZoneRule(fareProperties.getThreeZones());
        addAnyBusJourneyRule(fareProperties.getBus(), TransportType.BUS);

        ruleCollection.setMaxFare(fareProperties.getMaximum());

        return ruleCollection;
    }

    private void addAnywhereInZoneOneRule(double chargeableAmount) {
        Rule rule = new Rule();
        rule.setChargeableFare(chargeableAmount);

        rule.addZonePair(createZonePair(Zone.ONE, Zone.ONE));

        ruleCollection.addRules(rule);
    }

    private void addAnyOneZoneOutsideZoneOneRule(double chargeableAmount) {
        Rule rule = new Rule();
        rule.setChargeableFare(chargeableAmount);

        rule.addZonePair(createZonePair(Zone.TWO, Zone.TWO));
        rule.addZonePair(createZonePair(Zone.THREE, Zone.THREE));

        ruleCollection.addRules(rule);
    }

    private void addAnyTwoZoneIncludingZoneOneRule(double chargeableAmount) {
        Rule rule = new Rule();
        rule.setChargeableFare(chargeableAmount);

        rule.addZonePair(createZonePair(Zone.ONE, Zone.TWO));
        rule.addZonePair(createZonePair(Zone.TWO, Zone.ONE));
        rule.addZonePair(createZonePair(Zone.ONE, Zone.THREE));
        rule.addZonePair(createZonePair(Zone.THREE, Zone.ONE));

        ruleCollection.addRules(rule);
    }

    private void addAnyTwoZoneExcludingZoneOneRule(double chargeableAmount) {
        Rule rule = new Rule();
        rule.setChargeableFare(chargeableAmount);

        rule.addZonePair(createZonePair(Zone.TWO, Zone.THREE));
        rule.addZonePair(createZonePair(Zone.THREE, Zone.TWO));

        ruleCollection.addRules(rule);
    }

    private void addAnyThreeZoneRule(double chargeableAmount) {
        Rule rule = new Rule();
        rule.setChargeableFare(chargeableAmount);

        ruleCollection.addRules(rule);
    }

    private void addAnyBusJourneyRule(double chargeableAmount, TransportType transportType) {
        Rule rule = new Rule();
        rule.setChargeableFare(chargeableAmount);
        rule.setTransportType(transportType);

        ruleCollection.addRules(rule);
    }

    private ZonePair createZonePair(Zone startZone, Zone endZone) {
        ZonePair zonePair = new ZonePair();
        zonePair.setStartZone(startZone);
        zonePair.setEndZone(endZone);
        return zonePair;
    }
}
