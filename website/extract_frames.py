import cv2
import os
import sys

def extract_frames(video_path, output_dir, max_frames=200):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    print(f"Extracting frames from {video_path}...")
    cap = cv2.VideoCapture(video_path)
    
    if not cap.isOpened():
        print(f"Error: Could not open video {video_path}")
        sys.exit(1)
        
    frame_count = 0
    extracted_count = 0
    
    # We want to extract around 150 frames. If the video has more, we skip some.
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"Total video frames: {total_frames}")
    
    # Calculate step to get roughly max_frames evenly spaced
    step = max(1, total_frames // max_frames)
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
            
        if frame_count % step == 0 and extracted_count < max_frames:
            # Save frame as 0001.jpg, 0002.jpg etc
            extracted_count += 1
            filename = f"{extracted_count:04d}.jpg"
            filepath = os.path.join(output_dir, filename)
            
            # Resize slightly to save memory on canvas if it's 4k, but keep it HD
            # frame = cv2.resize(frame, (1920, 1080))
            cv2.imwrite(filepath, frame, [int(cv2.IMWRITE_JPEG_QUALITY), 80])
            
            if extracted_count % 20 == 0:
                print(f"Extracted {extracted_count} frames...")
                
        frame_count += 1
        
    cap.release()
    print(f"Done! Extracted {extracted_count} frames to {output_dir}")

if __name__ == "__main__":
    video_file = "public/nexus-bg-hd.mp4"
    out_dir = "public/frames"
    extract_frames(video_file, out_dir, max_frames=150)
