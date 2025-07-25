import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { resetUserAccount, getUserTripCount } from '@/service/AccountService';
import { toast } from 'sonner';
import { Trash2, AlertTriangle, RefreshCw } from 'lucide-react';

function ResetAccount({ user, onAccountReset }) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [tripCount, setTripCount] = useState(0);
  const [step, setStep] = useState(1); // 1: Warning, 2: Confirmation, 3: Final confirmation

  const CONFIRM_TEXT = 'DELETE MY ACCOUNT';

  const loadTripCount = useCallback(async () => {
    if (user?.email) {
      const count = await getUserTripCount(user.email);
      setTripCount(count);
    }
  }, [user?.email]);

  useEffect(() => {
    if (isOpen && user?.email) {
      loadTripCount();
    }
  }, [isOpen, user?.email, loadTripCount]);

  const handleReset = async () => {
    if (confirmText !== CONFIRM_TEXT) {
      toast.error(`Please type "${CONFIRM_TEXT}" exactly to confirm`);
      return;
    }

    setIsResetting(true);
    
    try {
      const success = await resetUserAccount(user.email);
      
      if (success) {
        setIsOpen(false);
        setStep(1);
        setConfirmText('');
        
        // Call the callback to refresh the trips list
        if (onAccountReset) {
          onAccountReset();
        }
        
        // Redirect to home or refresh the page
        setTimeout(() => {
          window.location.href = '/my-trips';
        }, 1500);
      }
    } catch (error) {
      console.error('Reset error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const resetDialog = () => {
    setIsOpen(false);
    setStep(1);
    setConfirmText('');
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="destructive" 
          size="sm"
          className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5"
          onClick={() => setIsOpen(true)}
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Reset Account
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Reset Your Account
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: Warning */}
        {step === 1 && (
          <div className="space-y-4">
            <DialogDescription className="text-gray-700">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-800 mb-2">⚠️ Warning: This action cannot be undone!</h4>
                    <p className="text-red-700 text-sm">
                      Resetting your account will permanently delete:
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <span>🗂️</span>
                  <span><strong>{tripCount}</strong> saved trip{tripCount === 1 ? '' : 's'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span>📊</span>
                  <span>All your trip itineraries and plans</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span>🏨</span>
                  <span>Hotel recommendations and bookmarks</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span>📍</span>
                  <span>Places to visit and custom notes</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-blue-800 text-sm">
                  <strong>💡 Alternative:</strong> You can manually delete individual trips from your "My Trips" page if you only want to remove specific ones.
                </p>
              </div>
            </DialogDescription>

            <div className="flex justify-between gap-3">
              <Button variant="outline" onClick={resetDialog}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={nextStep}
                disabled={tripCount === 0}
              >
                {tripCount === 0 ? 'No Trips to Delete' : 'I Understand, Continue'}
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: User Confirmation */}
        {step === 2 && (
          <div className="space-y-4">
            <DialogDescription>
              <div className="text-center space-y-3">
                <div className="text-6xl">🔥</div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Are you absolutely sure?
                </h3>
                <p className="text-gray-600">
                  This will delete <strong>{tripCount} trip{tripCount === 1 ? '' : 's'}</strong> for{' '}
                  <strong className="text-blue-600">{user.email}</strong>
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-yellow-800 text-sm">
                    Once deleted, you'll need to create new trips from scratch. Your account will become a fresh, empty account.
                  </p>
                </div>
              </div>
            </DialogDescription>

            <div className="flex justify-between gap-3">
              <Button variant="outline" onClick={prevStep}>
                Go Back
              </Button>
              <Button variant="destructive" onClick={nextStep}>
                Yes, Delete Everything
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Final Confirmation */}
        {step === 3 && (
          <div className="space-y-4">
            <DialogDescription>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">⚡</div>
                  <h3 className="text-lg font-semibold text-red-600">
                    Final Confirmation Required
                  </h3>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm mb-3">
                    To confirm account reset, please type the following text exactly:
                  </p>
                  <div className="bg-white border rounded p-2 text-center">
                    <code className="text-red-600 font-mono font-bold">{CONFIRM_TEXT}</code>
                  </div>
                </div>

                <Input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={`Type "${CONFIRM_TEXT}" here`}
                  className="text-center font-mono"
                  disabled={isResetting}
                />

                <div className="text-xs text-gray-500 text-center">
                  This action will delete {tripCount} trip{tripCount === 1 ? '' : 's'} and cannot be undone.
                </div>
              </div>
            </DialogDescription>

            <div className="flex justify-between gap-3">
              <Button variant="outline" onClick={prevStep} disabled={isResetting}>
                Go Back
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleReset}
                disabled={confirmText !== CONFIRM_TEXT || isResetting}
                className="min-w-[120px]"
              >
                {isResetting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  'Reset My Account'
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ResetAccount;
