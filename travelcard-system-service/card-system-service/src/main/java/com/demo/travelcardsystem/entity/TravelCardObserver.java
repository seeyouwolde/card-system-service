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
            System.out.println("DEBUG: TravelCardObserver - Journey is null, no action taken.");
            return;
        }

        double maxFare = fareCalculator
                .getTravelStrategy()
                .getRuleCollection()
                .getMaxFare();

        System.out.println("DEBUG: TravelCardObserver - Card: " + travelCard.getCardNumber() + ", Current Balance: " + travelCard.getBalance() + ", Max Fare: " + maxFare + ", Journey Completed: " + journey.isJourneyCompleted());

        if (journey.isJourneyCompleted()) {
            System.out.println("DEBUG: TravelCardObserver - Journey completed. Adding max fare back: " + maxFare);
            travelCard.addCredit(maxFare);
            System.out.println("DEBUG: TravelCardObserver - Balance after adding max fare: " + travelCard.getBalance());
            debitChargeableFare(travelCard);
        } else {
            System.out.println("DEBUG: TravelCardObserver - Journey started. Debiting max fare: " + maxFare);
            travelCard.debitAmount(maxFare);
            System.out.println("DEBUG: TravelCardObserver - Balance after debiting max fare: " + travelCard.getBalance());
        }
    }

    private void debitChargeableFare(TravelCard travelCard) {
        double maxFare = fareCalculator
                .getTravelStrategy()
                .getRuleCollection()
                .getMaxFare();

        Double calculatedFare = fareCalculator.calculate(travelCard.getCurrentJourney());

        System.out.println("DEBUG: debitChargeableFare - Max Fare: " + maxFare + ", Calculated Fare: " + calculatedFare);

        if (calculatedFare == null) {
            System.out.println("DEBUG: debitChargeableFare - Calculated fare is null. Debiting max fare: " + maxFare);
            travelCard.debitAmount(maxFare);
        } else {
            System.out.println("DEBUG: debitChargeableFare - Debiting calculated fare: " + calculatedFare);
            travelCard.debitAmount(calculatedFare);
        }
        System.out.println("DEBUG: debitChargeableFare - Balance after final debit: " + travelCard.getBalance());
    }
}
