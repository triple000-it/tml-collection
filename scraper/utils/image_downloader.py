"""
Image downloader utility for DJ profile images.
Downloads and processes images from various sources.
"""

import os
import requests
import hashlib
from urllib.parse import urlparse, urljoin
from PIL import Image, ImageOps
from typing import Optional, Dict, Any
import aiohttp
import asyncio
from pathlib import Path

class ImageDownloader:
    """
    Handles downloading and processing of DJ profile images.
    Supports multiple image formats and automatic resizing.
    """
    
    # Supported image formats
    SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp']
    
    # Image processing settings
    TARGET_SIZE = (400, 400)  # Square format for cards
    QUALITY = 85
    
    def __init__(self, output_dir: str = "public/dj-images"):
        """
        Initialize the image downloader.
        
        Args:
            output_dir: Directory to save downloaded images
        """
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # Create subdirectories for different image types
        (self.output_dir / "original").mkdir(exist_ok=True)
        (self.output_dir / "processed").mkdir(exist_ok=True)
        (self.output_dir / "thumbnails").mkdir(exist_ok=True)
    
    def download_image(self, url: str, dj_id: str, dj_name: str = "") -> Optional[Dict[str, str]]:
        """
        Download and process a DJ image from URL.
        
        Args:
            url: Image URL to download
            dj_id: Unique DJ identifier
            dj_name: DJ name for logging
            
        Returns:
            Dict with image paths or None if failed
        """
        try:
            # Validate URL
            if not self._is_valid_image_url(url):
                print(f"Invalid image URL for {dj_name}: {url}")
                return None
            
            # Download image
            response = requests.get(url, timeout=30, stream=True)
            response.raise_for_status()
            
            # Determine file extension
            content_type = response.headers.get('content-type', '')
            extension = self._get_extension_from_content_type(content_type)
            
            if not extension:
                # Try to get extension from URL
                extension = self._get_extension_from_url(url)
            
            if not extension:
                extension = '.jpg'  # Default fallback
            
            # Generate filename
            filename = f"{dj_id}{extension}"
            original_path = self.output_dir / "original" / filename
            
            # Save original image
            with open(original_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            # Process image
            processed_path = self._process_image(original_path, dj_id)
            thumbnail_path = self._create_thumbnail(original_path, dj_id)
            
            return {
                'original': str(original_path),
                'processed': str(processed_path),
                'thumbnail': str(thumbnail_path),
                'web_path': f"/dj-images/{dj_id}{extension}",
                'filename': filename
            }
            
        except Exception as e:
            print(f"Error downloading image for {dj_name} ({dj_id}): {str(e)}")
            return None
    
    async def download_image_async(self, url: str, dj_id: str, dj_name: str = "") -> Optional[Dict[str, str]]:
        """
        Asynchronously download and process a DJ image from URL.
        
        Args:
            url: Image URL to download
            dj_id: Unique DJ identifier
            dj_name: DJ name for logging
            
        Returns:
            Dict with image paths or None if failed
        """
        try:
            # Validate URL
            if not self._is_valid_image_url(url):
                print(f"Invalid image URL for {dj_name}: {url}")
                return None
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, timeout=30) as response:
                    if response.status != 200:
                        print(f"Failed to download image for {dj_name}: HTTP {response.status}")
                        return None
                    
                    # Determine file extension
                    content_type = response.headers.get('content-type', '')
                    extension = self._get_extension_from_content_type(content_type)
                    
                    if not extension:
                        extension = self._get_extension_from_url(url)
                    
                    if not extension:
                        extension = '.jpg'
                    
                    # Generate filename
                    filename = f"{dj_id}{extension}"
                    original_path = self.output_dir / "original" / filename
                    
                    # Save original image
                    with open(original_path, 'wb') as f:
                        async for chunk in response.content.iter_chunked(8192):
                            f.write(chunk)
                    
                    # Process image
                    processed_path = self._process_image(original_path, dj_id)
                    thumbnail_path = self._create_thumbnail(original_path, dj_id)
                    
                    return {
                        'original': str(original_path),
                        'processed': str(processed_path),
                        'thumbnail': str(thumbnail_path),
                        'web_path': f"/dj-images/{dj_id}{extension}",
                        'filename': filename
                    }
                    
        except Exception as e:
            print(f"Error downloading image for {dj_name} ({dj_id}): {str(e)}")
            return None
    
    def _is_valid_image_url(self, url: str) -> bool:
        """Check if URL is a valid image URL."""
        if not url or not isinstance(url, str):
            return False
        
        # Check if URL has valid scheme
        parsed = urlparse(url)
        if not parsed.scheme or parsed.scheme not in ['http', 'https']:
            return False
        
        # Check if URL has valid domain
        if not parsed.netloc:
            return False
        
        return True
    
    def _get_extension_from_content_type(self, content_type: str) -> Optional[str]:
        """Get file extension from content type header."""
        content_type_map = {
            'image/jpeg': '.jpg',
            'image/jpg': '.jpg',
            'image/png': '.png',
            'image/webp': '.webp',
            'image/gif': '.gif'
        }
        return content_type_map.get(content_type.lower())
    
    def _get_extension_from_url(self, url: str) -> Optional[str]:
        """Get file extension from URL path."""
        parsed = urlparse(url)
        path = parsed.path.lower()
        
        for ext in self.SUPPORTED_FORMATS:
            if path.endswith(ext):
                return ext
        
        return None
    
    def _process_image(self, original_path: Path, dj_id: str) -> Path:
        """
        Process image: resize, crop, and optimize for card display.
        
        Args:
            original_path: Path to original image
            dj_id: DJ identifier
            
        Returns:
            Path to processed image
        """
        try:
            # Open and process image
            with Image.open(original_path) as img:
                # Convert to RGB if necessary
                if img.mode in ('RGBA', 'LA', 'P'):
                    img = img.convert('RGB')
                
                # Create square crop (center crop)
                img = ImageOps.fit(img, self.TARGET_SIZE, Image.Resampling.LANCZOS)
                
                # Save processed image
                processed_filename = f"{dj_id}_processed.jpg"
                processed_path = self.output_dir / "processed" / processed_filename
                
                img.save(processed_path, 'JPEG', quality=self.QUALITY, optimize=True)
                
                return processed_path
                
        except Exception as e:
            print(f"Error processing image {original_path}: {str(e)}")
            return original_path
    
    def _create_thumbnail(self, original_path: Path, dj_id: str) -> Path:
        """
        Create a thumbnail version of the image.
        
        Args:
            original_path: Path to original image
            dj_id: DJ identifier
            
        Returns:
            Path to thumbnail image
        """
        try:
            # Open and process image
            with Image.open(original_path) as img:
                # Convert to RGB if necessary
                if img.mode in ('RGBA', 'LA', 'P'):
                    img = img.convert('RGB')
                
                # Create thumbnail (150x150)
                img.thumbnail((150, 150), Image.Resampling.LANCZOS)
                
                # Save thumbnail
                thumbnail_filename = f"{dj_id}_thumb.jpg"
                thumbnail_path = self.output_dir / "thumbnails" / thumbnail_filename
                
                img.save(thumbnail_path, 'JPEG', quality=80, optimize=True)
                
                return thumbnail_path
                
        except Exception as e:
            print(f"Error creating thumbnail {original_path}: {str(e)}")
            return original_path
    
    def get_image_info(self, dj_id: str) -> Optional[Dict[str, str]]:
        """
        Get information about existing images for a DJ.
        
        Args:
            dj_id: DJ identifier
            
        Returns:
            Dict with image paths or None if not found
        """
        # Look for existing images
        for ext in self.SUPPORTED_FORMATS:
            filename = f"{dj_id}{ext}"
            original_path = self.output_dir / "original" / filename
            
            if original_path.exists():
                processed_path = self.output_dir / "processed" / f"{dj_id}_processed.jpg"
                thumbnail_path = self.output_dir / "thumbnails" / f"{dj_id}_thumb.jpg"
                
                return {
                    'original': str(original_path),
                    'processed': str(processed_path) if processed_path.exists() else None,
                    'thumbnail': str(thumbnail_path) if thumbnail_path.exists() else None,
                    'web_path': f"/dj-images/{filename}",
                    'filename': filename
                }
        
        return None
    
    def cleanup_old_images(self, dj_id: str):
        """
        Remove old images for a DJ (useful when updating).
        
        Args:
            dj_id: DJ identifier
        """
        # Remove from all directories
        for subdir in ["original", "processed", "thumbnails"]:
            subdir_path = self.output_dir / subdir
            
            for ext in self.SUPPORTED_FORMATS:
                filename = f"{dj_id}{ext}"
                file_path = subdir_path / filename
                if file_path.exists():
                    file_path.unlink()
            
            # Remove processed and thumbnail versions
            processed_file = subdir_path / f"{dj_id}_processed.jpg"
            if processed_file.exists():
                processed_file.unlink()
            
            thumbnail_file = subdir_path / f"{dj_id}_thumb.jpg"
            if thumbnail_file.exists():
                thumbnail_file.unlink()
    
    def batch_download(self, dj_list: list, max_concurrent: int = 5) -> Dict[str, Any]:
        """
        Download images for multiple DJs concurrently.
        
        Args:
            dj_list: List of DJ dictionaries with 'id', 'name', and 'image_url'
            max_concurrent: Maximum concurrent downloads
            
        Returns:
            Dict with download results
        """
        async def download_batch():
            semaphore = asyncio.Semaphore(max_concurrent)
            
            async def download_with_semaphore(dj_data):
                async with semaphore:
                    return await self.download_image_async(
                        dj_data['image_url'],
                        dj_data['id'],
                        dj_data['name']
                    )
            
            tasks = [download_with_semaphore(dj) for dj in dj_list]
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            return results
        
        # Run the batch download
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            results = loop.run_until_complete(download_batch())
        finally:
            loop.close()
        
        # Process results
        successful = 0
        failed = 0
        results_dict = {}
        
        for i, result in enumerate(results):
            dj_id = dj_list[i]['id']
            if isinstance(result, Exception):
                print(f"Failed to download image for {dj_list[i]['name']}: {str(result)}")
                failed += 1
                results_dict[dj_id] = None
            elif result:
                successful += 1
                results_dict[dj_id] = result
            else:
                failed += 1
                results_dict[dj_id] = None
        
        return {
            'successful': successful,
            'failed': failed,
            'total': len(dj_list),
            'results': results_dict
        }
