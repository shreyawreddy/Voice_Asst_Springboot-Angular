import { Component, NgZone } from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    NgIf
  ]
})
export class AppComponent {
  assistantSaid: string = '';
  recognition: any;

  constructor(private zone: NgZone) {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = false;

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.sendToBackend(transcript);
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event);
      };
    } else {
      alert('Speech Recognition not supported in this browser.');
    }
  }

  startListening() {
    if (this.recognition) {
      this.recognition.start();
    }
  }

  sendToBackend(transcript: string) {
    fetch('http://localhost:8082/api/speak', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: transcript
    })
      .then(res => res.text())
      .then(responseText => {
        console.log('RECEIVED from backend:', responseText); // Log for debug

        this.zone.run(() => {
          this.assistantSaid = responseText;
          console.log('UPDATED assistantSaid:', this.assistantSaid); // Confirm update inside zone
        });

        setTimeout(() => {
          const synth = window.speechSynthesis;
          const utter = new SpeechSynthesisUtterance(responseText);
          synth.speak(utter);
        }, 100);
      });
  }
}
