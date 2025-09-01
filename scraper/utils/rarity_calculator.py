"""
Rarity calculation system for TML Collect DJ cards.
Based on real-world Tomorrowland performance history.
"""

from typing import Dict, List, Any
from datetime import datetime
import math

class RarityCalculator:
    """
    Calculates DJ card rarity based on multiple factors:
    - Total Tomorrowland appearances
    - Years active at Tomorrowland
    - Main stage performances
    - Special events (closing, opening, etc.)
    - International recognition
    """
    
    # Rarity thresholds
    RARITY_THRESHOLDS = {
        'LEGENDARY': {
            'min_appearances': 10,
            'min_years': 5,
            'main_stage_bonus': 3,
            'special_events_bonus': 2
        },
        'EPIC': {
            'min_appearances': 5,
            'min_years': 3,
            'main_stage_bonus': 2,
            'special_events_bonus': 1
        },
        'RARE': {
            'min_appearances': 2,
            'min_years': 2,
            'main_stage_bonus': 1,
            'special_events_bonus': 0
        },
        'COMMON': {
            'min_appearances': 1,
            'min_years': 1,
            'main_stage_bonus': 0,
            'special_events_bonus': 0
        }
    }
    
    # Special event types that boost rarity
    SPECIAL_EVENTS = [
        'closing ceremony',
        'opening ceremony',
        'mainstage closing',
        'mainstage opening',
        'special guest',
        'surprise performance',
        'anniversary performance',
        'record breaking set'
    ]
    
    # Main stages that provide rarity bonus
    MAIN_STAGES = [
        'mainstage',
        'main stage',
        'tomorrowland mainstage',
        'the library',
        'crystal garden'
    ]
    
    @classmethod
    def calculate_rarity(cls, dj_data: Dict[str, Any]) -> str:
        """
        Calculate DJ rarity based on performance data.
        
        Args:
            dj_data: Dictionary containing DJ performance information
            
        Returns:
            str: Rarity level ('COMMON', 'RARE', 'EPIC', 'LEGENDARY')
        """
        # Extract performance data
        total_appearances = dj_data.get('total_appearances', 0)
        years_active = dj_data.get('years_active', 0)
        performances = dj_data.get('performances', [])
        
        # Calculate bonus points
        main_stage_bonus = cls._calculate_main_stage_bonus(performances)
        special_events_bonus = cls._calculate_special_events_bonus(performances)
        international_bonus = cls._calculate_international_bonus(dj_data)
        
        # Calculate weighted score
        base_score = total_appearances * 1.0
        years_score = years_active * 0.5
        main_stage_score = main_stage_bonus * 2.0
        special_events_score = special_events_bonus * 3.0
        international_score = international_bonus * 1.5
        
        total_score = base_score + years_score + main_stage_score + special_events_score + international_score
        
        # Determine rarity based on score and thresholds
        if total_score >= 25 or (total_appearances >= 10 and years_active >= 5):
            return 'LEGENDARY'
        elif total_score >= 15 or (total_appearances >= 5 and years_active >= 3):
            return 'EPIC'
        elif total_score >= 8 or (total_appearances >= 2 and years_active >= 2):
            return 'RARE'
        else:
            return 'COMMON'
    
    @classmethod
    def _calculate_main_stage_bonus(cls, performances: List[Dict]) -> int:
        """Calculate bonus points for main stage performances."""
        main_stage_count = 0
        for performance in performances:
            stage = performance.get('stage', '').lower()
            if any(main_stage in stage for main_stage in cls.MAIN_STAGES):
                main_stage_count += 1
        return main_stage_count
    
    @classmethod
    def _calculate_special_events_bonus(cls, performances: List[Dict]) -> int:
        """Calculate bonus points for special event performances."""
        special_events_count = 0
        for performance in performances:
            notes = performance.get('notes', '').lower()
            event_type = performance.get('event_type', '').lower()
            
            # Check for special event keywords
            for special_event in cls.SPECIAL_EVENTS:
                if special_event in notes or special_event in event_type:
                    special_events_count += 1
                    break
        return special_events_count
    
    @classmethod
    def _calculate_international_bonus(cls, dj_data: Dict[str, Any]) -> int:
        """Calculate bonus points for international recognition."""
        bonus = 0
        
        # Social media following bonus
        social_links = dj_data.get('social_links', {})
        instagram_followers = social_links.get('instagram_followers', 0)
        spotify_monthly_listeners = dj_data.get('spotify_monthly_listeners', 0)
        
        if instagram_followers > 1000000:  # 1M+ followers
            bonus += 2
        elif instagram_followers > 500000:  # 500K+ followers
            bonus += 1
            
        if spotify_monthly_listeners > 5000000:  # 5M+ monthly listeners
            bonus += 2
        elif spotify_monthly_listeners > 1000000:  # 1M+ monthly listeners
            bonus += 1
        
        # Awards and recognition
        awards = dj_data.get('awards', [])
        if awards:
            bonus += len(awards)
        
        # Record label status
        record_label = dj_data.get('record_label', '').lower()
        major_labels = ['spinnin records', 'armada music', 'revealed recordings', 'musical freedom', 'protocol recordings']
        if any(label in record_label for label in major_labels):
            bonus += 1
        
        return bonus
    
    @classmethod
    def get_rarity_stats(cls, rarity: str) -> Dict[str, Any]:
        """
        Get statistics and styling information for a rarity level.
        
        Args:
            rarity: Rarity level string
            
        Returns:
            Dict containing rarity statistics and styling info
        """
        rarity_info = {
            'COMMON': {
                'name': 'Common',
                'color': '#6B7280',
                'gradient': 'common-gradient',
                'shadow': 'common',
                'animation': 'none',
                'drop_rate': '60%',
                'description': 'Newcomers and rising talents'
            },
            'RARE': {
                'name': 'Rare',
                'color': '#3B82F6',
                'gradient': 'rare-gradient',
                'shadow': 'rare',
                'animation': 'rare-sparkle',
                'drop_rate': '25%',
                'description': 'Established artists with growing recognition'
            },
            'EPIC': {
                'name': 'Epic',
                'color': '#8B5CF6',
                'gradient': 'epic-gradient',
                'shadow': 'epic',
                'animation': 'epic-shimmer',
                'drop_rate': '12%',
                'description': 'Major artists with significant Tomorrowland history'
            },
            'LEGENDARY': {
                'name': 'Legendary',
                'color': '#F59E0B',
                'gradient': 'legendary-gradient',
                'shadow': 'legendary',
                'animation': 'legendary-pulse',
                'drop_rate': '3%',
                'description': 'Tomorrowland legends and global superstars'
            }
        }
        
        return rarity_info.get(rarity, rarity_info['COMMON'])
    
    @classmethod
    def calculate_rarity_percentage(cls, dj_data: Dict[str, Any]) -> float:
        """
        Calculate the exact rarity percentage (0-100) for a DJ.
        Lower percentage = rarer card.
        
        Args:
            dj_data: Dictionary containing DJ performance information
            
        Returns:
            float: Rarity percentage (0-100)
        """
        rarity = cls.calculate_rarity(dj_data)
        
        # Base percentages for each rarity tier
        base_percentages = {
            'LEGENDARY': 3.0,
            'EPIC': 12.0,
            'RARE': 25.0,
            'COMMON': 60.0
        }
        
        base_percentage = base_percentages[rarity]
        
        # Add variation based on exact score
        total_appearances = dj_data.get('total_appearances', 0)
        years_active = dj_data.get('years_active', 0)
        
        # More appearances = slightly rarer within the tier
        if rarity == 'LEGENDARY':
            if total_appearances >= 15:
                base_percentage -= 1.0
            elif total_appearances >= 20:
                base_percentage -= 1.5
        elif rarity == 'EPIC':
            if total_appearances >= 8:
                base_percentage -= 2.0
        elif rarity == 'RARE':
            if total_appearances >= 4:
                base_percentage -= 3.0
        
        return max(0.1, base_percentage)  # Minimum 0.1% rarity
