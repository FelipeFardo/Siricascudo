import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import scalarDocs from '@scalar/fastify-api-reference'
import { env } from '@siricascudo/env'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from './error-handler'
// import { session } from './middlewares/session'
import { authenticateWithGithub } from './routes/auth/authenticate-with-github'
import { authenticateWithPassword } from './routes/auth/authenticate-with-password'
import { createAccount } from './routes/auth/create-account'
import { createSessionVisitor } from './routes/auth/create-session-visitor'
import { getProfile } from './routes/auth/get-profile'
import { requestPasswordRecover } from './routes/auth/request-passoword-recover'
import { resetPassword } from './routes/auth/reset-password'
import { getCart } from './routes/cart/get-cart'
import { getCartDetails } from './routes/cart/get-cart-details'
import { InsertItemToCart } from './routes/cart/insert-item-to-cart'
import { RemoveItemToCart } from './routes/cart/remove-item-to-cart'
import { acceptInvite } from './routes/invites/accept-invite'
import { createInvite } from './routes/invites/create-invite'
import { getInvite } from './routes/invites/get-invite'
import { getInvites } from './routes/invites/get-invites'
import { getPendingInvites } from './routes/invites/get-pending-invites'
import { rejectInvite } from './routes/invites/reject-invite'
import { revokeInvite } from './routes/invites/revoke-invite'
import { getMembers } from './routes/members/get-members'
import { removeMember } from './routes/members/remove-member'
import { updateMember } from './routes/members/update-member'
import { approveOrder } from './routes/orders/approve-order'
import { CancelOrder } from './routes/orders/cancel-order'
import { deliverOrder } from './routes/orders/deliver-order'
import { dispatchOrder } from './routes/orders/dispatch-order'
import { getOrderDetails } from './routes/orders/get-order-details'
import { getOrders } from './routes/orders/get-orders'
import { createOrganization } from './routes/orgs/create-organization'
import { getMemberOrganizations } from './routes/orgs/get-member-organizations'
import { getMembership } from './routes/orgs/get-membership'
import { getOrganization } from './routes/orgs/get-organization'
import { getOrganizations } from './routes/orgs/get-organizations'
import { shutdownOrganization } from './routes/orgs/shutdown-organization'
import { transferOrganization } from './routes/orgs/transfer-organization'
import { updateImageOrganization } from './routes/orgs/update-image-organization'
import { updateOrganization } from './routes/orgs/update-organization'
import { getProduct } from './routes/products/get-product'
import { getProducts } from './routes/products/get-products'
import { createUpload } from './routes/uploads/create-upload'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler(errorHandler)

app.register(scalarDocs, {
  routePrefix: '/docs',
  configuration: {
    spec: {
      content: () => app.swagger(),
    },
  },
})

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Next.js SaaS',
      description: 'Full-stack SaaS app with multi-tenant & RBAC.',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(fastifyCookie, {
  secret: 'cookie-fastify-secret',
})

app.register(fastifyCors)

app.register(createAccount)
app.register(authenticateWithPassword)
app.register(getProfile)
app.register(requestPasswordRecover)
app.register(resetPassword)
app.register(authenticateWithGithub)
app.register(createSessionVisitor)

app.register(createOrganization)
app.register(getMemberOrganizations)
app.register(getMembership)
app.register(getOrganization)
app.register(updateOrganization)
app.register(shutdownOrganization)
app.register(transferOrganization)
app.register(getOrganizations)
app.register(updateImageOrganization)

app.register(getMembers)
app.register(updateMember)
app.register(removeMember)

app.register(createInvite)
app.register(getInvite)
app.register(getInvites)
app.register(acceptInvite)
app.register(rejectInvite)
app.register(revokeInvite)
app.register(getPendingInvites)

app.register(getOrders)
app.register(approveOrder)
app.register(CancelOrder)
app.register(deliverOrder)
app.register(dispatchOrder)
app.register(getOrderDetails)

app.register(getProduct)
app.register(getProducts)

app.register(getCart)
app.register(getCartDetails)
app.register(InsertItemToCart)
app.register(RemoveItemToCart)

app.register(createUpload)

app.listen({ port: env.SERVER_PORT }).then(() => {
  console.log('HTTP server running!')
})
