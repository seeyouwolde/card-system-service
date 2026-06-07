package com.demo.travelcardsystem.repository;

import com.demo.travelcardsystem.entity.Journey;
import com.demo.travelcardsystem.entity.Station;
import com.demo.travelcardsystem.entity.TravelCard;
import com.demo.travelcardsystem.entity.TravelCardObserver;
import com.demo.travelcardsystem.exception.InvalidCardException;
import com.demo.travelcardsystem.exception.InvalidDataProvidedException;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Repository
public class InMemoryCardTransactionRepository {

    private final TravelCardJpaRepository travelCardJpaRepository;
    private final StationJpaRepository stationJpaRepository;
    private final TravelCardObserver travelCardObserver;

    /*
     * Current journey is temporary trip state.
     * TravelCard balance is saved in MySQL, but currentJourney is not saved because it is @Transient.
     */
    private final Map<String, Journey> currentJourneyStore = new ConcurrentHashMap<>();

    public InMemoryCardTransactionRepository(
            TravelCardJpaRepository travelCardJpaRepository,
            StationJpaRepository stationJpaRepository,
            TravelCardObserver travelCardObserver) {
        this.travelCardJpaRepository = travelCardJpaRepository;
        this.stationJpaRepository = stationJpaRepository;
        this.travelCardObserver = travelCardObserver;
    }

    public TravelCard registerNewCard(TravelCard travelCard) {
        if (travelCardJpaRepository.existsById(travelCard.getCardNumber())) {
            throw new InvalidCardException("Card already exists");
        }

        travelCard.registerObserver(travelCardObserver);
        return travelCardJpaRepository.save(travelCard);
    }

    public TravelCard findCardByCardNumber(String cardNumber) {
        TravelCard travelCard = travelCardJpaRepository.findById(cardNumber)
                .orElseThrow(() -> new InvalidCardException("Card not found"));

        travelCard.registerObserver(travelCardObserver);

        Journey currentJourney = findCurrentJourneyByCardNumber(cardNumber);
        travelCard.setCurrentJourney(currentJourney);

        return travelCard;
    }

    public List<String> fetchAllCardNumber() {
        return travelCardJpaRepository.findAll()
                .stream()
                .map(TravelCard::getCardNumber)
                .collect(Collectors.toList());
    }

    public Boolean addAllStationsToStationStore(Set<Station> stations) {
        stationJpaRepository.saveAll(stations);
        return true;
    }

    public Station findStationByName(String stationName) {
        return stationJpaRepository.findById(stationName)
                .orElseThrow(InvalidDataProvidedException::new);
    }

    public List<Station> fetchAllStations() {
        return stationJpaRepository.findAll();
    }

    public TravelCard updateCard(TravelCard travelCard) {
        travelCard.registerObserver(travelCardObserver);
        return travelCardJpaRepository.save(travelCard);
    }

    public Journey findCurrentJourneyByCardNumber(String cardNumber) {
        return currentJourneyStore.get(cardNumber);
    }

    public void saveCurrentJourney(String cardNumber, Journey journey) {
        currentJourneyStore.put(cardNumber, journey);
    }

    public void clearCurrentJourney(String cardNumber) {
        currentJourneyStore.remove(cardNumber);
    }

    public void clearTravelCardStore() {
        currentJourneyStore.clear();
        travelCardJpaRepository.deleteAll();
    }

    public void clearStationStore() {
        stationJpaRepository.deleteAll();
    }
}