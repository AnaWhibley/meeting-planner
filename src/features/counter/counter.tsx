import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    decrement,
    increment,
    incrementByAmount,
    incrementByAmount2,
    setAmount,
    incrementAsync,
    selectCount,
} from './counterSlice';

export function Counter() {
    const count = useSelector(selectCount);
    const amount = useSelector((state: any) => state.counter.amount);
    const isBusy = useSelector((state: any) => state.uiState.isBusy);
    const dispatch = useDispatch();
    const [incrementAmount, setIncrementAmount] = useState('2');

    return (
        <div>
            <div>
                <button
                    aria-label="Increment value"
                    onClick={() => dispatch(increment())}
                >
                    +
                </button>
                <span >{count}</span>
                <button
                    aria-label="Decrement value"
                    onClick={() => dispatch(decrement())}
                >
                    -
                </button>
            </div>
            <div>
                <input
                    aria-label="Set increment amount"
                    value={incrementAmount}
                    onChange={e => setIncrementAmount(e.target.value)}
                />
                <button
                    onClick={() =>
                        dispatch(incrementByAmount(Number(incrementAmount) || 0))
                    }
                >
                    Add Amount
                </button>
                <button
                    onClick={() => dispatch(incrementAsync(Number(incrementAmount) || 0))}
                >
                    Add Async
                </button>
            </div>
            <div>
                V2
                <input
                    aria-label="Set increment amount"
                    value={amount}
                    onChange={e =>      dispatch(setAmount(Number(e.target.value)))}
                />
                <button
                    onClick={() =>
                        dispatch(incrementByAmount2())
                    }
                >
                    Add Amount
                </button>
                <button
                    onClick={() => dispatch(incrementAsync(Number(amount) || 0))}
                >
                    Add Async
                </button>
            </div>
            {isBusy.toString()}
        </div>
    );
}
