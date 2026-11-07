import { useMemo, Suspense, useEffect, useCallback, createContext } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { getStorage, useLocalStorage } from 'src/hooks/use-local-storage';

import { PRODUCT_CHECKOUT_STEPS } from 'src/_mock/_product';

import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export const CheckoutContext = createContext(undefined);

export const CheckoutConsumer = CheckoutContext.Consumer;

const STORAGE_KEY = 'app-checkout';

const initialState = {
  items: [],
  subtotal: 0,
  total: 0,
  discount: 0,
  shipping: 0,
  billing: null,
  totalItems: 0,
  // Add step completion tracking
  completedSteps: [],
};

// ----------------------------------------------------------------------

export function CheckoutProvider({ children }) {
  return (
    <Suspense fallback={<SplashScreen />}>
      <Container>{children}</Container>
    </Suspense>
  );
}

// ----------------------------------------------------------------------

function Container({ children }) {
  const router = useRouter();

  const searchParams = useSearchParams();

  const activeStep = Number(searchParams.get('step'));

  const { state, setState, setField, canReset, resetState } = useLocalStorage(
    STORAGE_KEY,
    initialState
  );

  const completed = activeStep === PRODUCT_CHECKOUT_STEPS.length;

  // Step validation functions
  const canAccessStep = useCallback((step) => {
    // Step 0 (Cart) is always accessible
    if (step === 0) return true;
    
    // For other steps, check if previous steps are completed
    if (step === 1) {
      // Step 1 requires cart to have items
      return state.items && state.items.length > 0;
    }
    
    if (step === 2) {
      // Step 2 requires billing address to be set
      return state.billing && Object.keys(state.billing).length > 0;
    }
    
    if (step === 3) {
      // Step 3 requires all previous steps to be completed
      return state.items && state.items.length > 0 && 
             state.billing && Object.keys(state.billing).length > 0;
    }
    
    return false;
  }, [state.items, state.billing]);

  // Validate current step access
  useEffect(() => {
    if (activeStep !== 0 && !canAccessStep(activeStep)) {
      // Redirect to the first accessible step
      let targetStep = 0;
      for (let i = activeStep - 1; i >= 0; i -= 1) {
        if (canAccessStep(i)) {
          targetStep = i;
          break;
        }
      }
      const href = createUrl('go', targetStep);
      router.replace(href);
    }
  }, [activeStep, canAccessStep, router]);

  const updateTotalField = useCallback(() => {
    const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);

    const subtotal = state.items.reduce((total, item) => total + item.quantity * item.price, 0);

    setField('subtotal', subtotal);
    setField('totalItems', totalItems);
    setField('total', state.subtotal - state.discount + state.shipping);
  }, [setField, state.discount, state.items, state.shipping, state.subtotal]);

  useEffect(() => {
    const restoredValue = getStorage(STORAGE_KEY);
    if (restoredValue) {
      updateTotalField();
    }
  }, [updateTotalField]);

  const initialStep = useCallback(() => {
    if (!activeStep) {
      const href = createUrl('go', 0);
      router.push(href);
    }
  }, [activeStep, router]);

  const onBackStep = useCallback(() => {
    const prevStep = activeStep - 1;
    if (prevStep >= 0 && canAccessStep(prevStep)) {
      const href = createUrl('back', activeStep);
      router.push(href);
    }
  }, [activeStep, router, canAccessStep]);

  const onNextStep = useCallback(() => {
    const nextStep = activeStep + 1;
    if (nextStep < PRODUCT_CHECKOUT_STEPS.length && canAccessStep(nextStep)) {
      const href = createUrl('next', activeStep);
      router.push(href);
    }
  }, [activeStep, router, canAccessStep]);

  const onGotoStep = useCallback(
    (step) => {
      // Only allow navigation to accessible steps
      if (canAccessStep(step)) {
        const href = createUrl('go', step);
        router.push(href);
      } else {
        // Find the highest accessible step
        let targetStep = 0;
        for (let i = step - 1; i >= 0; i -= 1) {
          if (canAccessStep(i)) {
            targetStep = i;
            break;
          }
        }
        const href = createUrl('go', targetStep);
        router.push(href);
      }
    },
    [router, canAccessStep]
  );

  const onAddToCart = useCallback(
    (newItem) => {
      const updatedItems = state.items.map((item) => {
        if (item.id === newItem.id) {
          const colorsAdded = [...item.colors, ...newItem.colors];

          const colors = colorsAdded.filter((color, index) => colorsAdded.indexOf(color) === index);

          return { ...item, colors, quantity: item.quantity + 1 };
        }
        return item;
      });

      if (!updatedItems.some((item) => item.id === newItem.id)) {
        updatedItems.push(newItem);
      }

      setField('items', updatedItems);
    },
    [setField, state.items]
  );

  const onDeleteCart = useCallback(
    (itemId) => {
      const updatedItems = state.items.filter((item) => item.id !== itemId);

      setField('items', updatedItems);
    },
    [setField, state.items]
  );

  const onIncreaseQuantity = useCallback(
    (itemId) => {
      const updatedItems = state.items.map((item) => {
        if (item.id === itemId) {
          const updatedNoOfPkg = item.noOfPkg + 1;

          return {
            ...item,
            noOfPkg: updatedNoOfPkg,
            quantity: updatedNoOfPkg * item.stdPkg,
          };
        }
        return item;
      });

      setField('items', updatedItems);
    },
    [setField, state.items]
  );

  const onDecreaseQuantity = useCallback(
    (itemId) => {
      const updatedItems = state.items.map((item) => {
        if (item.id === itemId) {
          const updatedNoOfPkg = item.noOfPkg - 1;

          return {
            ...item,
            noOfPkg: updatedNoOfPkg,
            quantity: updatedNoOfPkg * item.stdPkg,
          };
        }
        return item;
      });

      setField('items', updatedItems);
    },
    [setField, state.items]
  );

  const onCreateBilling = useCallback(
    (address) => {
      setField('billing', address);
      onNextStep();
    },
    [onNextStep, setField]
  );

  const onApplyDiscount = useCallback(
    (discount) => {
      setField('discount', discount);
    },
    [setField]
  );

  const onApplyShipping = useCallback(
    (shipping) => {
      setField('shipping', shipping);
    },
    [setField]
  );

  // Reset
  const onReset = useCallback(() => {
    if (completed) {
      resetState();
      router.push(paths.product.root);
    }
  }, [completed, resetState, router]);

  const memoizedValue = useMemo(
    () => ({
      ...state,
      canReset,
      onReset,
      onUpdate: setState,
      onUpdateField: setField,
      //
      completed,
      //
      onAddToCart,
      onDeleteCart,
      //
      onIncreaseQuantity,
      onDecreaseQuantity,
      //
      onCreateBilling,
      onApplyDiscount,
      onApplyShipping,
      //
      activeStep,
      initialStep,
      onBackStep,
      onNextStep,
      onGotoStep,
      // Add step validation
      canAccessStep,
    }),
    [
      state,
      onReset,
      canReset,
      setField,
      completed,
      setState,
      activeStep,
      onBackStep,
      onGotoStep,
      onNextStep,
      initialStep,
      onAddToCart,
      onDeleteCart,
      onApplyDiscount,
      onApplyShipping,
      onCreateBilling,
      onDecreaseQuantity,
      onIncreaseQuantity,
      canAccessStep,
    ]
  );

  return <CheckoutContext.Provider value={memoizedValue}>{children}</CheckoutContext.Provider>;
}

// ----------------------------------------------------------------------

function createUrl(type, activeStep) {
  const step = { back: activeStep - 1, next: activeStep + 1, go: activeStep }[type];

  const stepParams = new URLSearchParams({ step: `${step}` }).toString();

  return `${paths.product.checkout}?${stepParams}`;
}
