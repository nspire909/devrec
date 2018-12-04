import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'etg-unsupported-browser',
  templateUrl: './unsupported-browser.component.html',
  styleUrls: ['./unsupported-browser.component.scss']
})
export class UnsupportedBrowserComponent implements OnInit {
  browser = 0;

  ngOnInit() {
    this.browser = detectIE();
  }
}

function detectIE(): number {
  const ua = window.navigator.userAgent;

  const msie = ua.indexOf('MSIE '); // IE 10: ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  const trident = ua.indexOf('Trident/'); // IE 11: ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
  if (trident > 0) {
    // IE 11 => return version number
    const rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  // other browser
  return 0;
}
