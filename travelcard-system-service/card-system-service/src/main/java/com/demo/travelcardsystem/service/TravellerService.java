package com.demo.travelcardsystem.service;

import com.demo.travelcardsystem.entity.Journey;
import com.demo.travelcardsystem.entity.Station;
import com.demo.travelcardsystem.entity.TravelCard;
import com.demo.travelcardsystem.exception.InvalidCardException;
import com.demo.travelcardsystem.exception.InvalidDataProvidedException;
import com.demo.travelcardsystem.exception.InvalidRechargeAmount;
import com.demo.travelcardsystem.model.request.CardRegistrationRequest;
import com.demo.travelcardsystem.model.request.SwipeRequest;
import com.demo.travelcardsystem.model.response.StationZoneResponse;
import com.demo.travelcardsystem.model.response.TravelCardResponse;
import com.demo.travelcardsystem.repository.InMemoryCardTransactionRepository;
import com.demo.travelcardsystem.service.util.TravelCardConverter;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TravellerService {

    private InMemoryCardTransactionRepository inMemoryCardTransactionRepository;
    private TravelCardConverter travelCardConverter;

    public void registerNewCard(CardRegistrationRequest cardRegistrationRequest) {
        if (cardRegistrationRequest == null
                || cardRegistrationRequest.getCardNumber() == null
                || cardRegistrationRequest.getCardNumber().isEmpty()) {
            throw new InvalidCardException("This card is Invalid. Please use a valid card");
        }

        if (cardRegistrationRequest.getBalance() == null || cardRegistrationRequest.getBalance() < 0) {
            throw new InvalidRechargeAmount("Recharge amount must not be negative");
        }

        TravelCard travelCard = new TravelCard();
        travelCard.setCardNumber(cardRegistrationRequest.getCardNumber());
        travelCard.setBalance(cardRegistrationRequest.getBalance());

        inMemoryCardTransactionRepository.registerNewCard(travelCard);
    }

    public void rechargeTheCard(String cardNumber, double rechargeAmount) {
        if (cardNumber == null || cardNumber.isEmpty()) {
            throw new InvalidCardException("This card is Invalid. Please use a valid card");
        }

        if (rechargeAmount < 0) {
            throw new InvalidRechargeAmount("Recharge amount must not be negative");
        }

        TravelCard travelCard = inMemoryCardTransactionRepository.findCardByCardNumber(cardNumber);
        travelCard.addCredit(rechargeAmount);

        inMemoryCardTransactionRepository.updateCard(travelCard);
    }

    public TravelCardResponse swipeCard(SwipeRequest swipeRequest) {
        if (swipeRequest == null
                || swipeRequest.getCardNumber() == null
                || swipeRequest.getCardNumber().isEmpty()
                || swipeRequest.getStationName() == null
                || swipeRequest.getStationName().isEmpty()
                || swipeRequest.getTransportType() == null) {
            throw new InvalidDataProvidedException();
        }

        TravelCard travelCard = inMemoryCardTransactionRepository.findCardByCardNumber(swipeRequest.getCardNumber());
        Station station = inMemoryCardTransactionRepository.findStationByName(swipeRequest.getStationName());

        Journey currentJourney = inMemoryCardTransactionRepository
                .findCurrentJourneyByCardNumber(travelCard.getCardNumber());

        if (currentJourney != null) {
            currentJourney.setEndStation(station);
            currentJourney.setJourneyCompleted(true);

            travelCard.setCurrentJourney(currentJourney);
            travelCard.notifyAllObservers();

            travelCard.setCurrentJourney(null);
            inMemoryCardTransactionRepository.clearCurrentJourney(travelCard.getCardNumber());
        } else {
            Journey journey = Journey.builder()
                    .startStation(station)
                    .transportType(swipeRequest.getTransportType())
                    .journeyCompleted(false)
                    .build();

            travelCard.setCurrentJourney(journey);
            travelCard.notifyAllObservers();

            inMemoryCardTransactionRepository.saveCurrentJourney(travelCard.getCardNumber(), journey);
        }

        inMemoryCardTransactionRepository.updateCard(travelCard);

        return travelCardConverter.travelCard2TravelCardResponseConverter.apply(travelCard);
    }

    public TravelCardResponse checkCardDetail(String cardNumber) {
        TravelCard travelCard = inMemoryCardTransactionRepository.findCardByCardNumber(cardNumber);

        Journey currentJourney = inMemoryCardTransactionRepository
                .findCurrentJourneyByCardNumber(cardNumber);

        travelCard.setCurrentJourney(currentJourney);

        return travelCardConverter.travelCard2TravelCardResponseConverter.apply(travelCard);
    }

    public List<String> fetchAllCard() {
        return inMemoryCardTransactionRepository.fetchAllCardNumber();
    }

    public List<StationZoneResponse> fetchAllStationsWithZones() {
        return inMemoryCardTransactionRepository.fetchAllStations()
                .stream()
                .map(station -> new StationZoneResponse(station.getName(), station.getZones()))
                .collect(Collectors.toList());
    }
}