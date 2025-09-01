"""
Main scraper script for TML Collect.
Orchestrates the scraping process and integrates rarity calculation.
"""

import os
import sys
import json
import asyncio
from pathlib import Path
from typing import Dict, List, Any

# Add the scraper directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from scrapers.tomorrowland import TomorrowlandScraper
from utils.rarity_calculator import RarityCalculator
from utils.image_downloader import ImageDownloader

class TMLCollectScraper:
    """
    Main scraper class that orchestrates the entire scraping process.
    """
    
    def __init__(self, output_dir: str = "scraper/data"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # Initialize components
        self.tomorrowland_scraper = TomorrowlandScraper()
        self.rarity_calculator = RarityCalculator()
        self.image_downloader = ImageDownloader()
        
        # Data storage
        self.djs_data = []
        self.events_data = []
        self.scraping_stats = {
            'total_djs': 0,
            'successful_downloads': 0,
            'failed_downloads': 0,
            'rarity_distribution': {
                'LEGENDARY': 0,
                'EPIC': 0,
                'RARE': 0,
                'COMMON': 0
            }
        }
    
    def run_full_scrape(self) -> Dict[str, Any]:
        """
        Run the complete scraping process.
        
        Returns:
            Dict containing scraping results and statistics
        """
        print("🎵 Starting TML Collect Scraper...")
        print("=" * 50)
        
        try:
            # Step 1: Scrape DJ and event data
            print("📊 Step 1: Scraping DJ and event data...")
            scraped_data = self.tomorrowland_scraper.scrape_all_data()
            self.djs_data = scraped_data['djs']
            self.events_data = scraped_data['events']
            self.scraping_stats['total_djs'] = len(self.djs_data)
            
            print(f"✅ Found {len(self.djs_data)} DJs and {len(self.events_data)} events")
            
            # Step 2: Calculate rarity for each DJ
            print("\n🎯 Step 2: Calculating rarity levels...")
            self._calculate_rarities()
            
            # Step 3: Download DJ images
            print("\n🖼️  Step 3: Downloading DJ images...")
            self._download_images()
            
            # Step 4: Save all data
            print("\n💾 Step 4: Saving data...")
            self._save_all_data()
            
            # Step 5: Generate summary
            print("\n📈 Step 5: Generating summary...")
            summary = self._generate_summary()
            
            print("\n🎉 Scraping completed successfully!")
            print("=" * 50)
            self._print_summary(summary)
            
            return {
                'success': True,
                'djs': self.djs_data,
                'events': self.events_data,
                'stats': self.scraping_stats,
                'summary': summary
            }
            
        except Exception as e:
            print(f"\n❌ Error during scraping: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'djs': self.djs_data,
                'events': self.events_data,
                'stats': self.scraping_stats
            }
    
    def _calculate_rarities(self):
        """Calculate rarity for each DJ."""
        for dj in self.djs_data:
            try:
                # Calculate rarity
                rarity = self.rarity_calculator.calculate_rarity(dj)
                dj['rarity'] = rarity
                
                # Get rarity stats
                rarity_stats = self.rarity_calculator.get_rarity_stats(rarity)
                dj['rarity_stats'] = rarity_stats
                
                # Calculate rarity percentage
                rarity_percentage = self.rarity_calculator.calculate_rarity_percentage(dj)
                dj['rarity_percentage'] = rarity_percentage
                
                # Update stats
                self.scraping_stats['rarity_distribution'][rarity] += 1
                
                print(f"  {dj['name']}: {rarity} ({rarity_percentage:.1f}%)")
                
            except Exception as e:
                print(f"  ❌ Error calculating rarity for {dj.get('name', 'Unknown')}: {str(e)}")
                dj['rarity'] = 'COMMON'
                dj['rarity_stats'] = self.rarity_calculator.get_rarity_stats('COMMON')
                dj['rarity_percentage'] = 60.0
                self.scraping_stats['rarity_distribution']['COMMON'] += 1
    
    def _download_images(self):
        """Download images for all DJs."""
        # Prepare DJ list for batch download
        dj_list = []
        for dj in self.djs_data:
            if dj.get('image_url'):
                dj_list.append({
                    'id': dj['id'],
                    'name': dj['name'],
                    'image_url': dj['image_url']
                })
        
        if not dj_list:
            print("  ⚠️  No DJs with image URLs found")
            return
        
        print(f"  📥 Downloading images for {len(dj_list)} DJs...")
        
        # Batch download images
        download_results = self.image_downloader.batch_download(dj_list, max_concurrent=3)
        
        # Update DJ data with image paths
        for dj in self.djs_data:
            dj_id = dj['id']
            if dj_id in download_results['results']:
                image_info = download_results['results'][dj_id]
                if image_info:
                    dj['image_paths'] = image_info
                    dj['has_image'] = True
                    self.scraping_stats['successful_downloads'] += 1
                else:
                    dj['has_image'] = False
                    self.scraping_stats['failed_downloads'] += 1
            else:
                dj['has_image'] = False
                self.scraping_stats['failed_downloads'] += 1
        
        print(f"  ✅ Successfully downloaded: {download_results['successful']}")
        print(f"  ❌ Failed downloads: {download_results['failed']}")
    
    def _save_all_data(self):
        """Save all scraped data to files."""
        # Save DJs data
        djs_file = self.output_dir / "djs.json"
        with open(djs_file, 'w', encoding='utf-8') as f:
            json.dump(self.djs_data, f, indent=2, ensure_ascii=False)
        
        # Save events data
        events_file = self.output_dir / "events.json"
        with open(events_file, 'w', encoding='utf-8') as f:
            json.dump(self.events_data, f, indent=2, ensure_ascii=False)
        
        # Save scraping stats
        stats_file = self.output_dir / "scraping_stats.json"
        with open(stats_file, 'w', encoding='utf-8') as f:
            json.dump(self.scraping_stats, f, indent=2, ensure_ascii=False)
        
        # Save database-ready data
        self._save_database_data()
        
        print(f"  💾 Data saved to {self.output_dir}/")
    
    def _save_database_data(self):
        """Save data in database-ready format."""
        # Prepare DJs for database insertion
        db_djs = []
        for dj in self.djs_data:
            db_dj = {
                'id': dj['id'],
                'stage_name': dj['stage_name'],
                'real_name': dj['real_name'],
                'biography': dj['biography'],
                'nationality': dj['nationality'],
                'genres': dj['genres'],
                'social_links': dj['social_links'],
                'debut_year': dj['debut_year'],
                'total_appearances': dj['total_appearances'],
                'image_url': dj.get('image_paths', {}).get('web_path', ''),
                'rarity': dj['rarity'],
                'created_at': dj['created_at'],
                'updated_at': dj['updated_at']
            }
            db_djs.append(db_dj)
        
        # Save database-ready DJs
        db_djs_file = self.output_dir / "db_djs.json"
        with open(db_djs_file, 'w', encoding='utf-8') as f:
            json.dump(db_djs, f, indent=2, ensure_ascii=False)
        
        # Prepare events for database insertion
        db_events = []
        for event in self.events_data:
            db_event = {
                'id': event['id'],
                'name': event['name'],
                'year': event['year'],
                'location': event['location'],
                'start_date': event['start_date'],
                'end_date': event['end_date'],
                'type': event['type'],
                'country': event['country']
            }
            db_events.append(db_event)
        
        # Save database-ready events
        db_events_file = self.output_dir / "db_events.json"
        with open(db_events_file, 'w', encoding='utf-8') as f:
            json.dump(db_events, f, indent=2, ensure_ascii=False)
    
    def _generate_summary(self) -> Dict[str, Any]:
        """Generate a summary of the scraping results."""
        total_djs = len(self.djs_data)
        successful_images = self.scraping_stats['successful_downloads']
        failed_images = self.scraping_stats['failed_downloads']
        
        # Calculate rarity percentages
        rarity_percentages = {}
        for rarity, count in self.scraping_stats['rarity_distribution'].items():
            if total_djs > 0:
                rarity_percentages[rarity] = (count / total_djs) * 100
            else:
                rarity_percentages[rarity] = 0
        
        # Find top DJs by rarity
        legendary_djs = [dj for dj in self.djs_data if dj['rarity'] == 'LEGENDARY']
        epic_djs = [dj for dj in self.djs_data if dj['rarity'] == 'EPIC']
        
        return {
            'total_djs': total_djs,
            'total_events': len(self.events_data),
            'image_downloads': {
                'successful': successful_images,
                'failed': failed_images,
                'success_rate': (successful_images / total_djs * 100) if total_djs > 0 else 0
            },
            'rarity_distribution': self.scraping_stats['rarity_distribution'],
            'rarity_percentages': rarity_percentages,
            'top_legendary_djs': [dj['name'] for dj in legendary_djs[:5]],
            'top_epic_djs': [dj['name'] for dj in epic_djs[:5]],
            'scraping_timestamp': self.djs_data[0]['created_at'] if self.djs_data else None
        }
    
    def _print_summary(self, summary: Dict[str, Any]):
        """Print a formatted summary of the scraping results."""
        print(f"📊 Total DJs scraped: {summary['total_djs']}")
        print(f"🎪 Total events found: {summary['total_events']}")
        print(f"🖼️  Image downloads: {summary['image_downloads']['successful']}/{summary['total_djs']} ({summary['image_downloads']['success_rate']:.1f}%)")
        
        print("\n🎯 Rarity Distribution:")
        for rarity, count in summary['rarity_distribution'].items():
            percentage = summary['rarity_percentages'][rarity]
            print(f"  {rarity}: {count} ({percentage:.1f}%)")
        
        if summary['top_legendary_djs']:
            print(f"\n⭐ Top Legendary DJs:")
            for dj in summary['top_legendary_djs']:
                print(f"  • {dj}")
        
        if summary['top_epic_djs']:
            print(f"\n🔥 Top Epic DJs:")
            for dj in summary['top_epic_djs']:
                print(f"  • {dj}")
        
        print(f"\n📁 Data saved to: {self.output_dir}/")
        print("🎉 Ready for database import and app deployment!")

def main():
    """Main function to run the scraper."""
    scraper = TMLCollectScraper()
    results = scraper.run_full_scrape()
    
    if results['success']:
        print("\n✅ Scraping completed successfully!")
        return 0
    else:
        print(f"\n❌ Scraping failed: {results['error']}")
        return 1

if __name__ == "__main__":
    exit(main())
