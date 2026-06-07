package com.demo.travelcardsystem.controller;

import com.demo.travelcardsystem.model.request.CardRegistrationRequest;
import com.demo.travelcardsystem.model.request.SwipeRequest;
import com.demo.travelcardsystem.model.response.StationZoneResponse;
import com.demo.travelcardsystem.model.response.TravelCardResponse;
import com.demo.travelcardsystem.service.TravellerService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/card")
@AllArgsConstructor
@CrossOrigin
public class TravellerController {

    private final TravellerService travellerService;

    @GetMapping(value = "/ping")
    public String pingMe() {
        return "Service is UP and Running";
    }

    @PostMapping(value = "/register")
    public void registerNewUser(@RequestBody CardRegistrationRequest cardRegistrationRequest) {
        travellerService.registerNewCard(cardRegistrationRequest);
    }

    @PostMapping(value = "/recharge/{rechargeAmount}")
    public void rechargeTheCard(@RequestBody String cardNumber, @PathVariable double rechargeAmount) {
        travellerService.rechargeTheCard(cardNumber, rechargeAmount);
    }

    @PostMapping(value = "/swipe")
    public TravelCardResponse swipeCard(@RequestBody SwipeRequest swipeRequest) {
        return travellerService.swipeCard(swipeRequest);
    }

    /*
     * Kept this endpoint for your existing frontend:
     * GET /api/card/details/{cardNumber}
     */
    @GetMapping(value = "/details/{cardNumber}")
    public TravelCardResponse checkCardDetailByDetailsPath(@PathVariable String cardNumber) {
        return travellerService.checkCardDetail(cardNumber);
    }

    /*
     * Added this endpoint because your test expects:
     * GET /api/card/{cardNumber}
     */
    @GetMapping(value = "/{cardNumber}")
    public TravelCardResponse checkCardDetail(@PathVariable String cardNumber) {
        return travellerService.checkCardDetail(cardNumber);
    }

    @GetMapping(value = "/cards")
    public List<String> fetchAllCard() {
        return travellerService.fetchAllCard();
    }

    @GetMapping(value = "/stations")
    public List<StationZoneResponse> fetchAllStationsWithZones() {
        return travellerService.fetchAllStationsWithZones();
    }
}