package com.example.springboot_voice_asst.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class VoiceController {

    @PostMapping(value = "/speak", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> speak(@RequestBody String transcript) {
        String responseText = getAssistantReply(transcript);
        return ResponseEntity.ok(responseText);
    }

    private String getAssistantReply(String transcript) {
        String cleaned = transcript.toLowerCase();

        if (cleaned.contains("weather")) {
            return "Today weather is sunny with a high of 75 degrees.";
        } else if (cleaned.contains("play music")) {
            return "Playing your favorite playlist.";
        } else if (cleaned.contains("time")) {
            return "It's " + java.time.LocalTime.now().withNano(0).toString();
        } else {
            return "Sorry, I didn't understand that.";
        }
    }
}