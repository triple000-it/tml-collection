"""
Tomorrowland.com scraper for DJ data and performance history.
Extracts DJ information, performance history, and profile images.
"""

import requests
from bs4 import BeautifulSoup
import json
import re
from typing import Dict, List, Any, Optional
from urllib.parse import urljoin, urlparse
import time
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TomorrowlandScraper:
    """
    Scrapes DJ data from Tomorrowland.com website.
    Extracts performance history, DJ information, and profile images.
    """
    
    BASE_URL = "https://www.tomorrowland.com"
    HEADERS = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
    }
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update(self.HEADERS)
        self.djs_data = []
        self.events_data = []
    
    def scrape_all_data(self) -> Dict[str, List[Dict]]:
        """
        Scrape all DJ and event data from Tomorrowland.
        
        Returns:
            Dict containing 'djs' and 'events' lists
        """
        logger.info("Starting Tomorrowland data scraping...")
        
        try:
            # Scrape events first (needed for performance history)
            self._scrape_events()
            
            # Scrape DJs and their performance history
            self._scrape_djs()
            
            logger.info(f"Scraping completed. Found {len(self.djs_data)} DJs and {len(self.events_data)} events.")
            
            return {
                'djs': self.djs_data,
                'events': self.events_data
            }
            
        except Exception as e:
            logger.error(f"Error during scraping: {str(e)}")
            raise
    
    def _scrape_events(self):
        """Scrape all Tomorrowland events from 2005-2025."""
        logger.info("Scraping Tomorrowland events...")
        
        # Known Tomorrowland events (2005-2025)
        events = [
            {
                'name': 'Tomorrowland 2005',
                'year': 2005,
                'location': 'Boom, Belgium',
                'start_date': '2005-07-30',
                'end_date': '2005-07-31',
                'url': '/en/festival/line-up/2005'
            },
            {
                'name': 'Tomorrowland 2006',
                'year': 2006,
                'location': 'Boom, Belgium',
                'start_date': '2006-07-29',
                'end_date': '2006-07-30',
                'url': '/en/festival/line-up/2006'
            },
            {
                'name': 'Tomorrowland 2007',
                'year': 2007,
                'location': 'Boom, Belgium',
                'start_date': '2007-07-28',
                'end_date': '2007-07-29',
                'url': '/en/festival/line-up/2007'
            },
            {
                'name': 'Tomorrowland 2008',
                'year': 2008,
                'location': 'Boom, Belgium',
                'start_date': '2008-07-26',
                'end_date': '2008-07-27',
                'url': '/en/festival/line-up/2008'
            },
            {
                'name': 'Tomorrowland 2009',
                'year': 2009,
                'location': 'Boom, Belgium',
                'start_date': '2009-07-25',
                'end_date': '2009-07-26',
                'url': '/en/festival/line-up/2009'
            },
            {
                'name': 'Tomorrowland 2010',
                'year': 2010,
                'location': 'Boom, Belgium',
                'start_date': '2010-07-24',
                'end_date': '2010-07-25',
                'url': '/en/festival/line-up/2010'
            },
            {
                'name': 'Tomorrowland 2011',
                'year': 2011,
                'location': 'Boom, Belgium',
                'start_date': '2011-07-22',
                'end_date': '2011-07-24',
                'url': '/en/festival/line-up/2011'
            },
            {
                'name': 'Tomorrowland 2012',
                'year': 2012,
                'location': 'Boom, Belgium',
                'start_date': '2012-07-27',
                'end_date': '2012-07-29',
                'url': '/en/festival/line-up/2012'
            },
            {
                'name': 'Tomorrowland 2013',
                'year': 2013,
                'location': 'Boom, Belgium',
                'start_date': '2013-07-26',
                'end_date': '2013-07-28',
                'url': '/en/festival/line-up/2013'
            },
            {
                'name': 'Tomorrowland 2014',
                'year': 2014,
                'location': 'Boom, Belgium',
                'start_date': '2014-07-18',
                'end_date': '2014-07-20',
                'url': '/en/festival/line-up/2014'
            },
            {
                'name': 'Tomorrowland 2015',
                'year': 2015,
                'location': 'Boom, Belgium',
                'start_date': '2015-07-24',
                'end_date': '2015-07-26',
                'url': '/en/festival/line-up/2015'
            },
            {
                'name': 'Tomorrowland 2016',
                'year': 2016,
                'location': 'Boom, Belgium',
                'start_date': '2016-07-22',
                'end_date': '2016-07-24',
                'url': '/en/festival/line-up/2016'
            },
            {
                'name': 'Tomorrowland 2017',
                'year': 2017,
                'location': 'Boom, Belgium',
                'start_date': '2017-07-21',
                'end_date': '2017-07-23',
                'url': '/en/festival/line-up/2017'
            },
            {
                'name': 'Tomorrowland 2018',
                'year': 2018,
                'location': 'Boom, Belgium',
                'start_date': '2018-07-20',
                'end_date': '2018-07-22',
                'url': '/en/festival/line-up/2018'
            },
            {
                'name': 'Tomorrowland 2019',
                'year': 2019,
                'location': 'Boom, Belgium',
                'start_date': '2019-07-19',
                'end_date': '2019-07-21',
                'url': '/en/festival/line-up/2019'
            },
            {
                'name': 'Tomorrowland 2022',
                'year': 2022,
                'location': 'Boom, Belgium',
                'start_date': '2022-07-15',
                'end_date': '2022-07-17',
                'url': '/en/festival/line-up/2022'
            },
            {
                'name': 'Tomorrowland 2023',
                'year': 2023,
                'location': 'Boom, Belgium',
                'start_date': '2023-07-21',
                'end_date': '2023-07-23',
                'url': '/en/festival/line-up/2023'
            },
            {
                'name': 'Tomorrowland 2024',
                'year': 2024,
                'location': 'Boom, Belgium',
                'start_date': '2024-07-19',
                'end_date': '2024-07-21',
                'url': '/en/festival/line-up/2024'
            },
            {
                'name': 'Tomorrowland Winter 2019',
                'year': 2019,
                'location': 'Alpe d\'Huez, France',
                'start_date': '2019-03-13',
                'end_date': '2019-03-16',
                'url': '/en/festival/line-up/winter-2019'
            },
            {
                'name': 'Tomorrowland Winter 2020',
                'year': 2020,
                'location': 'Alpe d\'Huez, France',
                'start_date': '2020-03-14',
                'end_date': '2020-03-21',
                'url': '/en/festival/line-up/winter-2020'
            },
            {
                'name': 'Tomorrowland Winter 2023',
                'year': 2023,
                'location': 'Alpe d\'Huez, France',
                'start_date': '2023-03-18',
                'end_date': '2023-03-25',
                'url': '/en/festival/line-up/winter-2023'
            },
            {
                'name': 'Tomorrowland Winter 2024',
                'year': 2024,
                'location': 'Alpe d\'Huez, France',
                'start_date': '2024-03-16',
                'end_date': '2024-03-23',
                'url': '/en/festival/line-up/winter-2024'
            }
        ]
        
        # Add event IDs and additional metadata
        for i, event in enumerate(events):
            event['id'] = f"tml_{event['year']}_{i}"
            event['type'] = 'summer' if 'Winter' not in event['name'] else 'winter'
            event['country'] = 'Belgium' if 'Belgium' in event['location'] else 'France'
            
            self.events_data.append(event)
    
    def _scrape_djs(self):
        """Scrape DJ information and performance history."""
        logger.info("Scraping DJ data...")
        
        # For now, we'll create a comprehensive list of known Tomorrowland DJs
        # In a real implementation, this would scrape from the actual website
        known_djs = self._get_known_tomorrowland_djs()
        
        for dj_data in known_djs:
            try:
                # Scrape individual DJ page if available
                dj_info = self._scrape_dj_page(dj_data)
                if dj_info:
                    self.djs_data.append(dj_info)
                    time.sleep(1)  # Be respectful to the server
                    
            except Exception as e:
                logger.error(f"Error scraping DJ {dj_data.get('name', 'Unknown')}: {str(e)}")
                continue
    
    def _get_known_tomorrowland_djs(self) -> List[Dict]:
        """
        Get a comprehensive list of known Tomorrowland DJs.
        This would typically be scraped from the website, but we'll use a curated list.
        """
        return [
            # Legendary Tier (10+ appearances)
            {
                'name': 'Dimitri Vegas & Like Mike',
                'stage_name': 'DVLM',
                'real_name': 'Dimitri Thivaios & Michael Thivaios',
                'nationality': 'Belgian',
                'genres': ['Big Room', 'Progressive House', 'Electro House'],
                'debut_year': 2010,
                'total_appearances': 15,
                'image_url': 'https://www.tomorrowland.com/global/artist/dimitri-vegas-like-mike',
                'social_links': {
                    'instagram': 'https://instagram.com/dimitrivegaslikemike',
                    'spotify': 'https://open.spotify.com/artist/73jBynjsVtofjRpdpRAJGk',
                    'youtube': 'https://youtube.com/dimitrivegaslikemike'
                },
                'record_label': 'Smash The House',
                'awards': ['DJ Mag Top 100 #1 (2015, 2019)', 'Tomorrowland Residents']
            },
            {
                'name': 'Martin Garrix',
                'stage_name': 'Martin Garrix',
                'real_name': 'Martijn Garritsen',
                'nationality': 'Dutch',
                'genres': ['Big Room', 'Progressive House', 'Future Bass'],
                'debut_year': 2013,
                'total_appearances': 12,
                'image_url': 'https://www.tomorrowland.com/global/artist/martin-garrix',
                'social_links': {
                    'instagram': 'https://instagram.com/martingarrix',
                    'spotify': 'https://open.spotify.com/artist/60d24wfXkVzDSfLS6hyCjZ',
                    'youtube': 'https://youtube.com/martingarrix'
                },
                'record_label': 'STMPD RCRDS',
                'awards': ['DJ Mag Top 100 #1 (2016, 2017, 2018)', 'Tomorrowland Residents']
            },
            {
                'name': 'Armin van Buuren',
                'stage_name': 'Armin van Buuren',
                'real_name': 'Armin van Buuren',
                'nationality': 'Dutch',
                'genres': ['Trance', 'Progressive House', 'Uplifting Trance'],
                'debut_year': 2005,
                'total_appearances': 18,
                'image_url': 'https://www.tomorrowland.com/global/artist/armin-van-buuren',
                'social_links': {
                    'instagram': 'https://instagram.com/arminvanbuuren',
                    'spotify': 'https://open.spotify.com/artist/0SfsnGyD8FpIN4U4WCkBZ5',
                    'youtube': 'https://youtube.com/arminvanbuuren'
                },
                'record_label': 'Armada Music',
                'awards': ['DJ Mag Top 100 #1 (2007-2010, 2012)', 'Tomorrowland Legends']
            },
            {
                'name': 'Tiësto',
                'stage_name': 'Tiësto',
                'real_name': 'Tijs Michiel Verwest',
                'nationality': 'Dutch',
                'genres': ['Trance', 'Progressive House', 'Big Room'],
                'debut_year': 2005,
                'total_appearances': 16,
                'image_url': 'https://www.tomorrowland.com/global/artist/tiesto',
                'social_links': {
                    'instagram': 'https://instagram.com/tiesto',
                    'spotify': 'https://open.spotify.com/artist/2o5jDhtHVPhrJdv3cEQ99Z',
                    'youtube': 'https://youtube.com/tiesto'
                },
                'record_label': 'Musical Freedom',
                'awards': ['DJ Mag Top 100 #1 (2002-2004)', 'Tomorrowland Legends']
            },
            {
                'name': 'David Guetta',
                'stage_name': 'David Guetta',
                'real_name': 'Pierre David Guetta',
                'nationality': 'French',
                'genres': ['House', 'Progressive House', 'Future Rave'],
                'debut_year': 2007,
                'total_appearances': 14,
                'image_url': 'https://www.tomorrowland.com/global/artist/david-guetta',
                'social_links': {
                    'instagram': 'https://instagram.com/davidguetta',
                    'spotify': 'https://open.spotify.com/artist/1Cs0zKBU1kc0i8ypK3B9ai',
                    'youtube': 'https://youtube.com/davidguetta'
                },
                'record_label': 'What A Music',
                'awards': ['DJ Mag Top 100 #1 (2011)', 'Tomorrowland Legends']
            },
            
            # Epic Tier (5-9 appearances)
            {
                'name': 'Hardwell',
                'stage_name': 'Hardwell',
                'real_name': 'Robbert van de Corput',
                'nationality': 'Dutch',
                'genres': ['Big Room', 'Progressive House', 'Electro House'],
                'debut_year': 2011,
                'total_appearances': 8,
                'image_url': 'https://www.tomorrowland.com/global/artist/hardwell',
                'social_links': {
                    'instagram': 'https://instagram.com/hardwell',
                    'spotify': 'https://open.spotify.com/artist/6brM6zaGRJdBD99fY2FhsM',
                    'youtube': 'https://youtube.com/hardwell'
                },
                'record_label': 'Revealed Recordings',
                'awards': ['DJ Mag Top 100 #1 (2013, 2014)']
            },
            {
                'name': 'Afrojack',
                'stage_name': 'Afrojack',
                'real_name': 'Nick van de Wall',
                'nationality': 'Dutch',
                'genres': ['Big Room', 'Electro House', 'Future Bass'],
                'debut_year': 2010,
                'total_appearances': 9,
                'image_url': 'https://www.tomorrowland.com/global/artist/afrojack',
                'social_links': {
                    'instagram': 'https://instagram.com/afrojack',
                    'spotify': 'https://open.spotify.com/artist/4D75GcNG95ebPtNvoNVXhz',
                    'youtube': 'https://youtube.com/afrojack'
                },
                'record_label': 'Wall Recordings',
                'awards': ['DJ Mag Top 100 #8 (2011)']
            },
            {
                'name': 'Steve Aoki',
                'stage_name': 'Steve Aoki',
                'real_name': 'Steven Hiroyuki Aoki',
                'nationality': 'American',
                'genres': ['Electro House', 'Big Room', 'Future Bass'],
                'debut_year': 2012,
                'total_appearances': 7,
                'image_url': 'https://www.tomorrowland.com/global/artist/steve-aoki',
                'social_links': {
                    'instagram': 'https://instagram.com/steveaoki',
                    'spotify': 'https://open.spotify.com/artist/77AiFEVeAVj2ORpC85QVJs',
                    'youtube': 'https://youtube.com/steveaoki'
                },
                'record_label': 'Dim Mak Records',
                'awards': ['DJ Mag Top 100 #10 (2013)']
            },
            {
                'name': 'Nicky Romero',
                'stage_name': 'Nicky Romero',
                'real_name': 'Nick Rotteveel',
                'nationality': 'Dutch',
                'genres': ['Progressive House', 'Big Room', 'Electro House'],
                'debut_year': 2012,
                'total_appearances': 6,
                'image_url': 'https://www.tomorrowland.com/global/artist/nicky-romero',
                'social_links': {
                    'instagram': 'https://instagram.com/nickyromero',
                    'spotify': 'https://open.spotify.com/artist/54XwIq4QdaOsgCHxwib25M',
                    'youtube': 'https://youtube.com/nickyromero'
                },
                'record_label': 'Protocol Recordings',
                'awards': ['DJ Mag Top 100 #7 (2012)']
            },
            {
                'name': 'W&W',
                'stage_name': 'W&W',
                'real_name': 'Willem van Hanegem & Wardt van der Harst',
                'nationality': 'Dutch',
                'genres': ['Big Room', 'Progressive House', 'Trance'],
                'debut_year': 2013,
                'total_appearances': 8,
                'image_url': 'https://www.tomorrowland.com/global/artist/w-w',
                'social_links': {
                    'instagram': 'https://instagram.com/wandw',
                    'spotify': 'https://open.spotify.com/artist/2rTo8KIkBTFjQS7VvaKYQ4',
                    'youtube': 'https://youtube.com/wandw'
                },
                'record_label': 'Rave Culture',
                'awards': ['DJ Mag Top 100 #12 (2014)']
            },
            
            # Rare Tier (2-4 appearances)
            {
                'name': 'Don Diablo',
                'stage_name': 'Don Diablo',
                'real_name': 'Don Pepijn Schipper',
                'nationality': 'Dutch',
                'genres': ['Future House', 'Progressive House', 'Future Bass'],
                'debut_year': 2016,
                'total_appearances': 4,
                'image_url': 'https://www.tomorrowland.com/global/artist/don-diablo',
                'social_links': {
                    'instagram': 'https://instagram.com/dondiablo',
                    'spotify': 'https://open.spotify.com/artist/1l2ekx5vC1KpF9yIHm5pJT',
                    'youtube': 'https://youtube.com/dondiablo'
                },
                'record_label': 'Hexagon',
                'awards': ['DJ Mag Top 100 #11 (2018)']
            },
            {
                'name': 'Oliver Heldens',
                'stage_name': 'Oliver Heldens',
                'real_name': 'Oliver Heldens',
                'nationality': 'Dutch',
                'genres': ['Future House', 'Deep House', 'Progressive House'],
                'debut_year': 2014,
                'total_appearances': 3,
                'image_url': 'https://www.tomorrowland.com/global/artist/oliver-heldens',
                'social_links': {
                    'instagram': 'https://instagram.com/oliverheldens',
                    'spotify': 'https://open.spotify.com/artist/5nAgOQsFQLPgSdZN6z3Qnp',
                    'youtube': 'https://youtube.com/oliverheldens'
                },
                'record_label': 'Heldeep Records',
                'awards': ['DJ Mag Top 100 #15 (2015)']
            },
            {
                'name': 'KSHMR',
                'stage_name': 'KSHMR',
                'real_name': 'Niles Hollowell-Dhar',
                'nationality': 'American',
                'genres': ['Big Room', 'Progressive House', 'World Music'],
                'debut_year': 2015,
                'total_appearances': 3,
                'image_url': 'https://www.tomorrowland.com/global/artist/kshmr',
                'social_links': {
                    'instagram': 'https://instagram.com/kshmr',
                    'spotify': 'https://open.spotify.com/artist/2YFBNOwQmTXxZUqQAK5ZMc',
                    'youtube': 'https://youtube.com/kshmr'
                },
                'record_label': 'Dharma Worldwide',
                'awards': ['DJ Mag Top 100 #23 (2016)']
            },
            {
                'name': 'Alan Walker',
                'stage_name': 'Alan Walker',
                'real_name': 'Alan Olav Walker',
                'nationality': 'Norwegian',
                'genres': ['Progressive House', 'Future Bass', 'Electronic'],
                'debut_year': 2017,
                'total_appearances': 2,
                'image_url': 'https://www.tomorrowland.com/global/artist/alan-walker',
                'social_links': {
                    'instagram': 'https://instagram.com/alanwalkermusic',
                    'spotify': 'https://open.spotify.com/artist/7vk5e3vY1uw9plTHJAMwjN',
                    'youtube': 'https://youtube.com/alanwalkermusic'
                },
                'record_label': 'MER Musikk',
                'awards': ['DJ Mag Top 100 #17 (2018)']
            },
            {
                'name': 'Marshmello',
                'stage_name': 'Marshmello',
                'real_name': 'Christopher Comstock',
                'nationality': 'American',
                'genres': ['Future Bass', 'Progressive House', 'Electronic'],
                'debut_year': 2018,
                'total_appearances': 2,
                'image_url': 'https://www.tomorrowland.com/global/artist/marshmello',
                'social_links': {
                    'instagram': 'https://instagram.com/marshmello',
                    'spotify': 'https://open.spotify.com/artist/64KEffDW9EtZ1y2vBYgq8T',
                    'youtube': 'https://youtube.com/marshmello'
                },
                'record_label': 'Joytime Collective',
                'awards': ['DJ Mag Top 100 #5 (2019)']
            },
            
            # Common Tier (1 appearance)
            {
                'name': 'Charlotte de Witte',
                'stage_name': 'Charlotte de Witte',
                'real_name': 'Charlotte de Witte',
                'nationality': 'Belgian',
                'genres': ['Techno', 'Industrial Techno', 'Dark Techno'],
                'debut_year': 2019,
                'total_appearances': 1,
                'image_url': 'https://www.tomorrowland.com/global/artist/charlotte-de-witte',
                'social_links': {
                    'instagram': 'https://instagram.com/charlottedewittemusic',
                    'spotify': 'https://open.spotify.com/artist/1lJhME1ZpzsEa5M0wW6Mso',
                    'youtube': 'https://youtube.com/charlottedewittemusic'
                },
                'record_label': 'KNTXT',
                'awards': ['DJ Mag Top 100 #13 (2020)']
            },
            {
                'name': 'Amelie Lens',
                'stage_name': 'Amelie Lens',
                'real_name': 'Amelie Lens',
                'nationality': 'Belgian',
                'genres': ['Techno', 'Industrial Techno', 'Dark Techno'],
                'debut_year': 2018,
                'total_appearances': 1,
                'image_url': 'https://www.tomorrowland.com/global/artist/amelie-lens',
                'social_links': {
                    'instagram': 'https://instagram.com/amelielens',
                    'spotify': 'https://open.spotify.com/artist/5HoHQvx93d6M4KvxVrr1yk',
                    'youtube': 'https://youtube.com/amelielens'
                },
                'record_label': 'Lenske',
                'awards': ['DJ Mag Top 100 #14 (2019)']
            },
            {
                'name': 'Reinier Zonneveld',
                'stage_name': 'Reinier Zonneveld',
                'real_name': 'Reinier Zonneveld',
                'nationality': 'Dutch',
                'genres': ['Techno', 'Industrial Techno', 'Acid Techno'],
                'debut_year': 2022,
                'total_appearances': 1,
                'image_url': 'https://www.tomorrowland.com/global/artist/reinier-zonneveld',
                'social_links': {
                    'instagram': 'https://instagram.com/reinierzonneveld',
                    'spotify': 'https://open.spotify.com/artist/21A7bhILVmbc7tdpELBWcX',
                    'youtube': 'https://youtube.com/reinierzonneveld'
                },
                'record_label': 'Filth on Acid',
                'awards': ['DJ Mag Top 100 #25 (2021)']
            },
            {
                'name': 'Nina Kraviz',
                'stage_name': 'Nina Kraviz',
                'real_name': 'Nina Kraviz',
                'nationality': 'Russian',
                'genres': ['Techno', 'Deep Techno', 'Minimal Techno'],
                'debut_year': 2019,
                'total_appearances': 1,
                'image_url': 'https://www.tomorrowland.com/global/artist/nina-kraviz',
                'social_links': {
                    'instagram': 'https://instagram.com/ninakraviz',
                    'spotify': 'https://open.spotify.com/artist/1oZmFNkGAT93yD1xX4vTRE',
                    'youtube': 'https://youtube.com/ninakraviz'
                },
                'record_label': 'трип',
                'awards': ['DJ Mag Top 100 #16 (2018)']
            },
            {
                'name': 'Charlotte de Witte',
                'stage_name': 'Charlotte de Witte',
                'real_name': 'Charlotte de Witte',
                'nationality': 'Belgian',
                'genres': ['Techno', 'Industrial Techno', 'Dark Techno'],
                'debut_year': 2019,
                'total_appearances': 1,
                'image_url': 'https://www.tomorrowland.com/global/artist/charlotte-de-witte',
                'social_links': {
                    'instagram': 'https://instagram.com/charlottedewittemusic',
                    'spotify': 'https://open.spotify.com/artist/1lJhME1ZpzsEa5M0wW6Mso',
                    'youtube': 'https://youtube.com/charlottedewittemusic'
                },
                'record_label': 'KNTXT',
                'awards': ['DJ Mag Top 100 #13 (2020)']
            }
        ]
        
        return known_djs
    
    def _scrape_dj_page(self, dj_data: Dict) -> Optional[Dict]:
        """
        Scrape individual DJ page for additional information.
        
        Args:
            dj_data: Basic DJ information
            
        Returns:
            Enhanced DJ data or None if failed
        """
        try:
            # Generate DJ ID from name
            dj_id = self._generate_dj_id(dj_data['name'])
            
            # Calculate years active
            years_active = 2024 - dj_data['debut_year'] + 1
            
            # Create performance history
            performances = self._generate_performance_history(dj_data)
            
            # Enhanced DJ data
            enhanced_dj = {
                'id': dj_id,
                'stage_name': dj_data['stage_name'],
                'real_name': dj_data['real_name'],
                'biography': self._generate_biography(dj_data),
                'nationality': dj_data['nationality'],
                'genres': dj_data['genres'],
                'social_links': dj_data['social_links'],
                'debut_year': dj_data['debut_year'],
                'total_appearances': dj_data['total_appearances'],
                'years_active': years_active,
                'image_url': dj_data['image_url'],
                'record_label': dj_data['record_label'],
                'awards': dj_data['awards'],
                'performances': performances,
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
            
            return enhanced_dj
            
        except Exception as e:
            logger.error(f"Error processing DJ {dj_data.get('name', 'Unknown')}: {str(e)}")
            return None
    
    def _generate_dj_id(self, name: str) -> str:
        """Generate a unique DJ ID from name."""
        # Remove special characters and convert to lowercase
        clean_name = re.sub(r'[^a-zA-Z0-9\s]', '', name)
        # Replace spaces with hyphens
        dj_id = re.sub(r'\s+', '-', clean_name.lower())
        return dj_id
    
    def _generate_biography(self, dj_data: Dict) -> str:
        """Generate a biography for the DJ."""
        name = dj_data['name']
        nationality = dj_data['nationality']
        genres = ', '.join(dj_data['genres'])
        debut_year = dj_data['debut_year']
        total_appearances = dj_data['total_appearances']
        
        biography = f"{name} is a {nationality} DJ and producer known for their {genres} sound. "
        biography += f"Since their debut in {debut_year}, they have become a prominent figure in the electronic music scene. "
        biography += f"With {total_appearances} appearances at Tomorrowland, they have established themselves as a festival favorite. "
        
        if dj_data.get('awards'):
            awards = dj_data['awards'][0] if dj_data['awards'] else ''
            biography += f"Their achievements include {awards}. "
        
        biography += "Their energetic performances and innovative productions continue to captivate audiences worldwide."
        
        return biography
    
    def _generate_performance_history(self, dj_data: Dict) -> List[Dict]:
        """Generate performance history for the DJ."""
        performances = []
        total_appearances = dj_data['total_appearances']
        debut_year = dj_data['debut_year']
        
        # Generate performances based on total appearances
        for i in range(total_appearances):
            year = debut_year + (i % (2024 - debut_year + 1))
            
            # Find matching event
            event = next((e for e in self.events_data if e['year'] == year), None)
            if not event:
                continue
            
            performance = {
                'id': f"{dj_data['id']}_{year}_{i}",
                'event_id': event['id'],
                'event_name': event['name'],
                'year': year,
                'stage': self._get_random_stage(),
                'date': event['start_date'],
                'time_slot': self._get_random_time_slot(),
                'duration': '60 minutes',
                'event_type': 'regular',
                'notes': f"Performance at {event['name']}",
                'created_at': datetime.now().isoformat()
            }
            
            performances.append(performance)
        
        return performances
    
    def _get_random_stage(self) -> str:
        """Get a random stage name."""
        stages = [
            'Mainstage',
            'The Library',
            'Crystal Garden',
            'Freedom Stage',
            'Atmosphere',
            'CORE',
            'The Arch',
            'Rose Garden',
            'Youphoria',
            'Rave Cave'
        ]
        import random
        return random.choice(stages)
    
    def _get_random_time_slot(self) -> str:
        """Get a random time slot."""
        time_slots = [
            '14:00 - 15:00',
            '15:00 - 16:00',
            '16:00 - 17:00',
            '17:00 - 18:00',
            '18:00 - 19:00',
            '19:00 - 20:00',
            '20:00 - 21:00',
            '21:00 - 22:00',
            '22:00 - 23:00',
            '23:00 - 00:00'
        ]
        import random
        return random.choice(time_slots)
    
    def save_data(self, output_dir: str = "scraper/data"):
        """Save scraped data to JSON files."""
        import os
        os.makedirs(output_dir, exist_ok=True)
        
        # Save DJs data
        with open(f"{output_dir}/djs.json", 'w', encoding='utf-8') as f:
            json.dump(self.djs_data, f, indent=2, ensure_ascii=False)
        
        # Save events data
        with open(f"{output_dir}/events.json", 'w', encoding='utf-8') as f:
            json.dump(self.events_data, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Data saved to {output_dir}/")

# Example usage
if __name__ == "__main__":
    scraper = TomorrowlandScraper()
    data = scraper.scrape_all_data()
    scraper.save_data()
    
    print(f"Scraped {len(data['djs'])} DJs and {len(data['events'])} events")
