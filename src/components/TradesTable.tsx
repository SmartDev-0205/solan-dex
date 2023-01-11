import { Col, Row, Divider} from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useMarket, useRaydiumTrades } from '../utils/markets';
import { getDecimalCount } from '../utils/utils';
import FloatingElement from './layout/FloatingElement';
import { TradeLayout } from '../utils/types';

const Title = styled.div`
  color: rgba(255, 255, 255, 1);
`;
const SizeTitle = styled(Row)`
  padding: 20px 0 14px;
  color: #434a59;
`;

export default function PublicTrades({ smallScreen }) {
  const { baseCurrency, quoteCurrency, market } = useMarket();
  const [trades, loaded] = useRaydiumTrades();
  const [height, setHeight] = useState(400);

  return (
    <FloatingElement
      setHeight={setHeight}
      style={
        smallScreen
          ? {
            flex: 1, overflow: 'hidden'
          }
          : {
            marginTop: '10px',
            flex: 1,
            overflow: 'hidden',
            ...styled,
          }
      }
    >
      <Divider>
        <Title>Recent Trades</Title>
      </Divider>
      <SizeTitle>
        <Col span={8}>Price ({quoteCurrency}) </Col>
        <Col span={8} style={{ textAlign: 'right' }}>
          Size ({baseCurrency})
        </Col>
        <Col span={8} style={{ textAlign: 'right' }}>
          Time
        </Col>
      </SizeTitle>
      {!!trades && loaded && (
        <div
          style={{
            marginRight: '-20px',
            paddingRight: '5px',
            overflowY: 'scroll',
            maxHeight: height - 115,
          }}
        >
          {trades.map((trade: TradeLayout, i: number) => (
            <Row key={i} style={{ marginBottom: 4 }}>
              <Col
                span={8}
                style={{
                  color: trade.side === 'buy' ? '#0AD171' : '#FD499D',
                }}
              >
                {market?.tickSize && !isNaN(trade.price)
                  ? Number(trade.price).toFixed(
                    getDecimalCount(market.tickSize),
                  )
                  : trade.price}
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                {market?.minOrderSize && !isNaN(trade.size)
                  ? Number(trade.size).toFixed(
                    getDecimalCount(market.minOrderSize),
                  )
                  : trade.size}
              </Col>
              <Col span={8} style={{ textAlign: 'right', color: '#676767' }}>
                {trade.time && new Date(trade.time).toLocaleTimeString()}
              </Col>
            </Row>
          ))}
        </div>
      )}
    </FloatingElement>
  );
}
