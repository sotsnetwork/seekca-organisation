import { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import 'react-image-crop/dist/ReactCrop.css';

interface ProfilePictureCropperProps {
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedImageBlob: Blob) => void;
  isUploading?: boolean;
}

export function ProfilePictureCropper({ 
  isOpen, 
  onClose, 
  onCropComplete, 
  isUploading = false 
}: ProfilePictureCropperProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [imgSrc, setImgSrc] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImgSrc(reader.result?.toString() || '');
      });
      reader.readAsDataURL(file);
    }
  };

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const cropSize = Math.min(width, height) * 0.9;
    const x = (width - cropSize) / 2;
    const y = (height - cropSize) / 2;
    
    setCrop({
      unit: 'px',
      width: cropSize,
      height: cropSize,
      x,
      y,
    });
  }, []);

  const getCroppedImg = useCallback(
    (image: HTMLImageElement, crop: PixelCrop): Promise<Blob> => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No 2d context');
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = crop.width;
      canvas.height = crop.height;

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas is empty'));
            }
          },
          'image/jpeg',
          0.9
        );
      });
    },
    []
  );

  const handleCropConfirm = useCallback(async () => {
    if (completedCrop && imgRef.current) {
      try {
        const croppedImageBlob = await getCroppedImg(imgRef.current, completedCrop);
        onCropComplete(croppedImageBlob);
      } catch (error) {
        console.error('Error cropping image:', error);
        toast({
          title: 'Error',
          description: 'Failed to crop image. Please try again.',
          variant: 'destructive',
        });
      }
    }
  }, [completedCrop, getCroppedImg, onCropComplete, toast]);

  const handleClose = () => {
    setImgSrc('');
    setImageFile(null);
    setCrop({
      unit: '%',
      width: 90,
      height: 90,
      x: 5,
      y: 5,
    });
    setCompletedCrop(undefined);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Profile Picture</DialogTitle>
          <DialogDescription>
            Choose a photo and crop it to a square format for your profile picture.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!imgSrc && (
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/70 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG or JPEG (MAX. 10MB)</p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={onSelectFile}
                />
              </label>
            </div>
          )}

          {imgSrc && (
            <div className="flex flex-col items-center space-y-4">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                className="max-w-full"
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc}
                  style={{ maxHeight: '400px', maxWidth: '100%' }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setImgSrc('');
                  setImageFile(null);
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Choose Different Image
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Cancel
          </Button>
          {imgSrc && (
            <Button 
              onClick={handleCropConfirm} 
              disabled={!completedCrop || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Save Profile Picture'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}