package com.demo.travelcardsystem.entity;

import com.demo.travelcardsystem.service.util.FareCalculator;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class TravelCardObserver implements Observer<TravelCard> {

    private final FareCalculator fareCalculator;

    @Override
    public void reactOnChange(TravelCard travelCard) {
        Journey journey = travelCard.getCurrentJourney();

        if (journey == null) {
            return;
        }

        double maxFare = fareCalculator
                .getTravelStrategy()
                .getRuleCollection()
                .getMaxFare();

        if (journey.isJourneyCompleted()) {
            travelCard.addCredit(maxFare);
            debitChargeableFare(travelCard);
        } else {
            travelCard.debitAmount(maxFare);
        }
    }

    private void debitChargeableFare(TravelCard travelCard) {
        double maxFare = fareCalculator
                .getTravelStrategy()
                .getRuleCollection()
                .getMaxFare();

        Double calculatedFare = fareCalculator.calculate(travelCard.getCurrentJourney());

        if (calculatedFare == null) {
            travelCard.debitAmount(maxFare);
        } else {
            travelCard.debitAmount(calculatedFare);
        }
    }
}